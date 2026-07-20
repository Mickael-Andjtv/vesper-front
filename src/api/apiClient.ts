import { OpenAPI } from "./core/OpenAPI";
import { DefaultService } from "./services/DefaultService";

OpenAPI.BASE = "http://localhost:8000";
export const vesperAPi = {
  generateResponseQuery: DefaultService.generateGeneratePost,
};
