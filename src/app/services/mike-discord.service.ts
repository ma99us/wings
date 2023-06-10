import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DISCORD_URL} from "../app-config";

@Injectable({
  providedIn: 'root'
})
export class MikeDiscordService {

  constructor(private http: HttpClient) {
  }

  private prepareHeaders<Type>(value: Type): any {
    const headers: any = {
      'Content-Type': 'application/json;charset=utf-8'
    };
    return headers;
  }

  postMessage(value: string) {
    const msg = {
      "content": value,
      "username": "WingsMailer",
      "avatar_url": "http://gerdov.com/wings/assets/wings_logo_40.png"
    }
    return this.http.post(DISCORD_URL, msg, {
      headers: this.prepareHeaders(msg)
    });
  }
}

