import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  userId: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin() {
    // 簡単な認証チェック（デモ用）
    if (this.userId && this.password) {
      this.router.navigate(['/portal']);
    } else {
      alert('ユーザIDとパスワードを入力してください。');
    }
  }
}
