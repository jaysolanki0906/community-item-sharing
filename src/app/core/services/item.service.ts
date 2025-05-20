import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import { Item } from '../models/item.model';
import { Interest } from '../models/interest.model';
import { Observable } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private api: ApiServiceService) {}

  getSharedItems(
    page: number,
    limit: number,
    status: string,
    search: string
  ): Observable<{ data: Item[], total: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('status', status)
      .set('search', search);
    return this.api.get<{ data: Item[], total: number }>('items/shared', { params });
  }

  getItemsWithPagination(page: number, limit: number, type: string, status: string, search: string): Observable<{ data: Item[], total: number }> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('type', type)
      .set('status', status)
      .set('search', search);
  
    return this.api.get<{ data: Item[], total: number }>('items', { params });
  }  

  getItems(
    type: string,
    page: number = 1,
    limit: number = 10
  ): Observable<{ data: Item[]; total: number }> {
    return this.api.get<{ data: Item[]; total: number }>(
      `items?type=${type}&page=${page}&limit=${limit}`
    );
  }
  
  getMyItems(
    page: number,
    limit: number,
    status: string,
    search: string
  ): Observable<{ data: Item[], total: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('status', status)
      .set('search', search);
  
    return this.api.get<{ data: Item[]; total: number }>('items/my', { params });
  }
  
  addItem(itemData: FormData) {
    return this.api.post<Item>('items', itemData);
  }

  updateItem(id: string, item: FormData) {
    return this.api.patch<Item>(`items/${id}`, item);
  }

deleteItem(id: string): Observable<void> {
  return this.api.delete<void>(`items/${id}`);
}

  getAllItems(): Observable<{ data: Item[]; total: number }> {
    return this.api.get<{ data: Item[]; total: number }>('items');
  }
  
  
  getItemInterests(itemId: string): Observable<Interest[]> {
    return this.api.get<Interest[]>(`items/${itemId}/interests`);
  }
  
}
