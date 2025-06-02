import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiServiceService } from './api-service.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InterestService {

  constructor(private api: ApiServiceService) {}

  showInterest(itemId: string) {
  // Use the correct endpoint as per your API docs, and send item_id in the body
  return this.api.post<{ message: string }>('item-interests', { item_id: itemId });
}

  getItemInterests(
    itemId: string,
    page: number = 1,
    limit: number = 10,
    search: string = '',
    filters: any = {}
  ): Observable<{ interests: any[], page_context: any }> {
    let params = new HttpParams()
      .set('item_id', itemId)
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) params = params.set('search', search);
    params = params.set('filters', JSON.stringify(filters));

    return this.api.get<{ interests: any[], page_context: any }>('item-interests', { params });
  }


  assignReceiver(itemId: number,userId: number) {
    return this.api.post(`items/${itemId}/assign-receiver`, {receiverUserId:userId});
  }
}
