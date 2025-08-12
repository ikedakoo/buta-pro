import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class ChatbotComponent {
  messages: ChatMessage[] = [
    {
      id: '1',
      text: 'こんにちは！BUTA-proのAIアシスタントです。配送計画や在庫管理について何でもお聞きください。',
      isUser: false,
      timestamp: new Date()
    }
  ];
  
  currentMessage = '';
  isTyping = false;

  constructor(private router: Router) {}

  sendMessage() {
    if (!this.currentMessage.trim()) return;

    // ユーザーメッセージを追加
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: this.currentMessage,
      isUser: true,
      timestamp: new Date()
    };
    this.messages.push(userMessage);

    // AIの応答をシミュレート
    this.isTyping = true;
    const userInput = this.currentMessage.toLowerCase();
    this.currentMessage = '';

    setTimeout(() => {
      const botResponse = this.generateBotResponse(userInput);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      this.messages.push(botMessage);
      this.isTyping = false;
    }, 1000 + Math.random() * 2000); // 1-3秒のランダムな遅延
  }

  private generateBotResponse(userInput: string): string {
    // キーワードベースの簡単な応答システム
    if (userInput.includes('配送') || userInput.includes('配達')) {
      return '配送計画について質問ですね。配送計画策定補助システムでは、倉庫を選択してエリア分割を行い、効率的なドライバー割り振りができます。1人あたり最大5件まで担当し、同じエリア内で複数のドライバーが協力します。';
    }
    
    if (userInput.includes('在庫') || userInput.includes('倉庫')) {
      return '在庫管理についてですね。現在、松戸倉庫、宇都宮倉庫、水戸倉庫、横浜倉庫、杉並倉庫、浦和倉庫の6つの倉庫が登録されています。在庫位置参照システムや在庫位置登録システムで詳細な管理が可能です。';
    }
    
    if (userInput.includes('ドライバー') || userInput.includes('運転手')) {
      return 'ドライバー管理についてですね。現在8名のドライバーが登録されており、配送計画時に自動的に割り振られます。エリア分割後は地理的に効率的な配送ルートで、1人あたり最大5件まで担当します。';
    }
    
    if (userInput.includes('エリア') || userInput.includes('分割')) {
      return 'エリア分割機能についてですね。K-meansクラスタリングアルゴリズムを使用して、配送地点を地理的に近い5つのエリアに自動分割します。各エリアは色分けされ、効率的な配送計画を立てることができます。';
    }
    
    if (userInput.includes('システム') || userInput.includes('機能')) {
      return 'BUTA-proには以下の機能があります：\n• 配送計画策定補助システム\n• 製造計画策定補助システム\n• 在庫位置参照システム\n• 在庫位置登録システム\n• 倉庫情報登録\n• 商品情報登録\n• ドライバー配送補助システム\n• 日報自動管理システム\n\nどの機能について詳しく知りたいですか？';
    }
    
    if (userInput.includes('使い方') || userInput.includes('操作')) {
      return '基本的な使い方をご説明します：\n1. ポータル画面から使いたい機能を選択\n2. 配送計画の場合：倉庫選択→エリア分割実行→明細確認\n3. 必要に応じてドライバーの割り振りを調整\n4. 変更を反映して完了\n\n具体的にどの操作でお困りですか？';
    }
    
    if (userInput.includes('ありがとう') || userInput.includes('感謝')) {
      return 'どういたしまして！他にもご質問がございましたら、いつでもお聞きください。BUTA-proを使った効率的な業務をサポートいたします。';
    }
    
    if (userInput.includes('こんにちは') || userInput.includes('はじめまして')) {
      return 'こんにちは！BUTA-proのAIアシスタントです。配送計画、在庫管理、製造計画など、様々な業務についてサポートいたします。何かお手伝いできることはありますか？';
    }

    // デフォルトの応答
    const defaultResponses = [
      'ご質問ありがとうございます。もう少し詳しく教えていただけますか？配送計画、在庫管理、システムの使い方など、どのようなことでお困りでしょうか？',
      'BUTA-proについてのご質問ですね。具体的にどの機能について知りたいですか？配送計画策定、在庫管理、ドライバー管理など、詳しくご説明いたします。',
      'お手伝いいたします！「配送」「在庫」「ドライバー」「システム」「使い方」などのキーワードで質問していただくと、より詳しい回答ができます。',
      'ご質問の内容をもう少し具体的に教えていただけますか？BUTA-proの各機能について詳しくサポートいたします。'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  backToPortal() {
    this.router.navigate(['/portal']);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
