import { Injectable } from "@angular/core"
import { HttpClient } from '@angular/common/http'
import { Observable } from "rxjs"

export interface formData{
    name_client: string
    email: string
    phone: string
    name_topic: string
    text_message: string
}

@Injectable({providedIn: 'root'})
export class FormService{
    constructor(private http: HttpClient) {}

    addFormData(formData: formData): Observable<formData>{
        return this.http.post<formData>('http://localhost/post_message.php', formData)
    }
    
}
