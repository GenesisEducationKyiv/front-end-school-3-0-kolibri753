import type { Result } from "neverthrow";
import type { ListParams } from "@/types";
import { env } from "@/config";
import type { IHttpClient } from "./httpClient";
import type { AppError } from "./errors";

/**
 * Generic CRUD wrapper
 */
export abstract class BaseService<T, CreateDto = Partial<T>> {
  protected readonly http: IHttpClient;
  protected readonly resource: string;

  protected constructor(http: IHttpClient, resource: string) {
    this.http = http;
    this.resource = resource;
  }

  /**
   * GET /resource
   */
  list<P extends ListParams = ListParams>(
    params?: P
  ): Promise<Result<T[], AppError>> {
    return this.http.get<T[]>(`${env.API_PREFIX}/${this.resource}`, { params });
  }

  /**
   * GET /resource/:id
   */
  getById(id: string): Promise<Result<T, AppError>> {
    return this.http.get<T>(`${env.API_PREFIX}/${this.resource}/${id}`);
  }

  /**
   * POST /resource
   */
  create(dto: CreateDto): Promise<Result<T, AppError>> {
    return this.http.post<T>(`${env.API_PREFIX}/${this.resource}`, dto);
  }

  /**
   * PUT /resource/:id
   */
  update(id: string, dto: CreateDto): Promise<Result<T, AppError>> {
    return this.http.put<T>(`${env.API_PREFIX}/${this.resource}/${id}`, dto);
  }

  /**
   * DELETE /resource/:id
   */
  delete(id: string): Promise<Result<void, AppError>> {
    return this.http.delete<void>(`${env.API_PREFIX}/${this.resource}/${id}`);
  }
}
