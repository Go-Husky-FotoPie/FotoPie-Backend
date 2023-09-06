import { Injectable, NotFoundException } from "@nestjs/common";
import { Posts } from "../posts/schema/post.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Query } from "express-serve-static-core";
import { Client } from "@elastic/elasticsearch";
import * as natural from "natural";
import * as stopword from "stopword";

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Posts.name) private readonly postsModel: Model<Posts>
  ) {}
  async getSearchPostsIdByTag(tag: string, query: Query): Promise<Posts[]> {
    const resPerPage = Number(query.limit);
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    //const regex = new RegExp(tag, "i");

    const tokenizer = new natural.WordTokenizer();
    const stemmer = natural.PorterStemmer;
    const stopwords = stopword.removeStopwords(tokenizer.tokenize(tag));

    const stemmedTerms = stopwords.map((term) => stemmer.stem(term));
    const searchText = stemmedTerms.join(" ");

    const terms = tag.trim().split(/\s+/);
    const regex = new RegExp(terms.join("|"), "i");

    const result1 = this.postsModel
      .find(
        { description: { $regex: regex } }
      )
      .sort({ createdAt: "desc" })
      .limit(resPerPage)
      .skip(skip);

    const result2 = this.postsModel
      .find(
        {
          $text: { $search: searchText },
          tags: { $in: tag.split(" ") },
        },
        { score: { $meta: "textScore" } }
      )
      .sort({ createdAt: "desc" })
      .limit(resPerPage)
      .sort({ score: { $meta: "textScore" } })
      .skip(skip);

    const combinedResults = await Promise.all([result1, result2]);

    const mergedResults = [...combinedResults[0], ...combinedResults[1]];
    const uniqueResults = new Set(
      mergedResults.map((post) => post._id.toString())
    );
    const result = Array.from(uniqueResults).map((postId) =>
      mergedResults.find((post) => post._id.toString() === postId)
    );

    if (!result) {
      throw new NotFoundException("Searched posts not found");
    }
    return result;
  }
}
