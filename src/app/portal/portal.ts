import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portal',
  imports: [CommonModule],
  templateUrl: './portal.html',
  styleUrl: './portal.css'
})
export class PortalComponent {
  
  systems = [
    {
      id: 'delivery-planning',
      name: '配送計画策定補助システム',
      description: '効率的な配送ルートの計画を支援',
      icon: '🚚'
    },
    {
      id: 'production-planning',
      name: '製造計画策定補助システム',
      description: '生産スケジュールの最適化を支援',
      icon: '🏭'
    },
    {
      id: 'inventory-reference',
      name: '在庫位置参照システム',
      description: '在庫の位置情報を確認',
      icon: '📦'
    },
    {
      id: 'inventory-registration',
      name: '在庫位置登録システム',
      description: '在庫の位置情報を登録',
      icon: '📝'
    },
    {
      id: 'warehouse-info',
      name: '倉庫情報登録',
      description: '倉庫の基本情報を管理',
      icon: '🏢'
    },
    {
      id: 'product-info',
      name: '商品情報登録',
      description: '商品の詳細情報を管理',
      icon: '🛍️'
    },
    {
      id: 'driver-support',
      name: 'ドライバー配送補助システム',
      description: 'ドライバーの配送業務を支援',
      icon: '🚛'
    },
    {
      id: 'daily-report',
      name: '日報自動管理システム',
      description: '日次レポートの自動生成と管理',
      icon: '📊'
    }
  ];

  constructor(private router: Router) {}

  navigateToSystem(systemId: string) {
    if (systemId === 'delivery-planning') {
      this.router.navigate(['/delivery-planning']);
    } else {
      // 他のシステムは未実装のため、アラートを表示
      alert(`${systemId}システムは現在開発中です。`);
    }
  }

  openChatbot() {
    this.router.navigate(['/chatbot']);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
