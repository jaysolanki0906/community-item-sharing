import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiServiceService } from './api-service.service';

@Injectable({
  providedIn: 'root'
})
export class InterestService {

  constructor(private api: ApiServiceService) {}

  showInterest(itemId: string){
    return this.api.post<{ message: string }>(`items/${itemId}/interests`, {});
  }

  getItemInterests(itemId: string) {
    return this.api.get<{ user_id: string; timestamp: string }[]>(`items/${itemId}/interests`);
  }

  assignReceiver(itemId: number,userId: number) {
    return this.api.post(`items/${itemId}/assign-receiver`, {receiverUserId:userId});
  }
}
