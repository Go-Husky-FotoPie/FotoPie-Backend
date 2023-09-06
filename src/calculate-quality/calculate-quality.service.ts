import { Injectable } from "@nestjs/common";
import { ClientCredentials } from "simple-oauth2";
import axios from "axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CalculateQualityService {
  private readonly oauth2: ClientCredentials;
  private readonly tokenConfig = {
    scope: "openid", // Set the scope based on the API documentation
  };

  constructor(private ConfigService: ConfigService) {
    const client = {
      
      client: {
        id: this.ConfigService.get("everypixel_id"),

        secret: this.ConfigService.get("everypixel_api_key"),
      },
      auth: {
        tokenHost: "https://api.everypixel.com",
        tokenPath: "/oauth/token",
      },
    };
    this.oauth2 = new ClientCredentials(client);
  }

  async getToken(): Promise<string> {
    try {
      const result = await this.oauth2.getToken(this.tokenConfig);
      return result.token.access_token;
    } catch (error) {
      console.error("Error fetching token", error);
      return "";
    }
  }

  async getQuality(params: {
    url?: string;
    data?: Record<string, any>;
  }): Promise<any> {
    const token = await this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      if (params.url) {
        const response = await axios.get(
          "https://api.everypixel.com/v1/quality_ugc",
          {
            headers,
            params,
          }
        );
        return response.data;
      } else {
        throw new Error('Either "url" or "data" parameter is required.');
      }
    } catch (error) {
      console.error("Error fetching quality", error);
      return "";
    }
  }
}
