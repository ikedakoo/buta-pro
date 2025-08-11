import { Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-delivery-planning',
  imports: [],
  templateUrl: './delivery-planning.html',
  styleUrl: './delivery-planning.css'
})
export class DeliveryPlanningComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: any;
  private deliveryPoints: any[] = [];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // 配送ポイントのデータを初期化
    this.initializeDeliveryPoints();
  }

  ngAfterViewInit() {
    // ブラウザ環境でのみマップを初期化
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeMap();
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private async initializeMap() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      // 動的にLeafletをインポート
      const leafletModule = await import('leaflet');
      const L = leafletModule.default || leafletModule;
      
      // 関東地方の中心座標
      const kantoCenter: [number, number] = [35.6762, 139.6503];

      // マップを初期化
      this.map = L.map('map').setView(kantoCenter, 9);

      // OpenStreetMapタイルレイヤーを追加
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // 配送ポイントをマップに追加
      this.addDeliveryPointsToMap(L);
    } catch (error) {
      console.error('地図の初期化に失敗しました:', error);
      // フォールバック: 地図が表示できない場合のメッセージを表示
      this.showMapError();
    }
  }

  private initializeDeliveryPoints() {
    this.deliveryPoints = [
      // 東京・千葉南部エリア（緑色）
      { lat: 35.6762, lng: 139.6503, area: '東京・千葉南部', color: '#4caf50' },
      { lat: 35.6895, lng: 139.6917, area: '東京・千葉南部', color: '#4caf50' },
      { lat: 35.6586, lng: 139.7454, area: '東京・千葉南部', color: '#4caf50' },
      { lat: 35.7090, lng: 139.7319, area: '東京・千葉南部', color: '#4caf50' },
      { lat: 35.6284, lng: 139.7364, area: '東京・千葉南部', color: '#4caf50' },
      { lat: 35.6581, lng: 139.7414, area: '東京・千葉南部', color: '#4caf50' },
      { lat: 35.6938, lng: 139.7036, area: '東京・千葉南部', color: '#4caf50' },
      { lat: 35.6329, lng: 139.8804, area: '東京・千葉南部', color: '#4caf50' },
      { lat: 35.6074, lng: 140.1233, area: '東京・千葉南部', color: '#4caf50' },
      { lat: 35.5888, lng: 140.0233, area: '東京・千葉南部', color: '#4caf50' },
      { lat: 35.6203, lng: 139.8836, area: '東京・千葉南部', color: '#4caf50' },
      { lat: 35.6447, lng: 139.7544, area: '東京・千葉南部', color: '#4caf50' },

      // 神奈川エリア（青色）
      { lat: 35.4437, lng: 139.6380, area: '神奈川', color: '#2196f3' },
      { lat: 35.4658, lng: 139.6201, area: '神奈川', color: '#2196f3' },
      { lat: 35.3906, lng: 139.4625, area: '神奈川', color: '#2196f3' },
      { lat: 35.5308, lng: 139.7029, area: '神奈川', color: '#2196f3' },
      { lat: 35.4478, lng: 139.3424, area: '神奈川', color: '#2196f3' },
      { lat: 35.3622, lng: 139.4700, area: '神奈川', color: '#2196f3' },
      { lat: 35.4017, lng: 139.5828, area: '神奈川', color: '#2196f3' },
      { lat: 35.5123, lng: 139.6178, area: '神奈川', color: '#2196f3' },
      { lat: 35.4560, lng: 139.6225, area: '神奈川', color: '#2196f3' },
      { lat: 35.3320, lng: 139.5570, area: '神奈川', color: '#2196f3' },
      { lat: 35.4180, lng: 139.3431, area: '神奈川', color: '#2196f3' },
      { lat: 35.4814, lng: 139.6503, area: '神奈川', color: '#2196f3' },

      // 埼玉エリア（オレンジ色）
      { lat: 35.8617, lng: 139.6455, area: '埼玉', color: '#ff9800' },
      { lat: 35.9097, lng: 139.6869, area: '埼玉', color: '#ff9800' },
      { lat: 35.7817, lng: 139.7817, area: '埼玉', color: '#ff9800' },
      { lat: 35.8256, lng: 139.8107, area: '埼玉', color: '#ff9800' },
      { lat: 35.8617, lng: 139.6455, area: '埼玉', color: '#ff9800' },
      { lat: 35.9097, lng: 139.6869, area: '埼玉', color: '#ff9800' },
      { lat: 35.8256, lng: 139.8107, area: '埼玉', color: '#ff9800' },
      { lat: 35.7817, lng: 139.7817, area: '埼玉', color: '#ff9800' },
      { lat: 35.8617, lng: 139.6455, area: '埼玉', color: '#ff9800' },
      { lat: 35.9097, lng: 139.6869, area: '埼玉', color: '#ff9800' },
      { lat: 35.8256, lng: 139.8107, area: '埼玉', color: '#ff9800' },
      { lat: 35.7817, lng: 139.7817, area: '埼玉', color: '#ff9800' },
      { lat: 35.8617, lng: 139.6455, area: '埼玉', color: '#ff9800' },
      { lat: 35.9097, lng: 139.6869, area: '埼玉', color: '#ff9800' },

      // 千葉北部・茨城南部エリア（紫色）
      { lat: 35.6074, lng: 140.1233, area: '千葉北部・茨城南部', color: '#9c27b0' },
      { lat: 35.8256, lng: 140.1107, area: '千葉北部・茨城南部', color: '#9c27b0' },
      { lat: 35.7817, lng: 140.2817, area: '千葉北部・茨城南部', color: '#9c27b0' },
      { lat: 35.9097, lng: 140.1869, area: '千葉北部・茨城南部', color: '#9c27b0' },
      { lat: 35.8617, lng: 140.2455, area: '千葉北部・茨城南部', color: '#9c27b0' },
      { lat: 35.7256, lng: 140.3107, area: '千葉北部・茨城南部', color: '#9c27b0' },
      { lat: 35.6817, lng: 140.2817, area: '千葉北部・茨城南部', color: '#9c27b0' },
      { lat: 35.8097, lng: 140.1869, area: '千葉北部・茨城南部', color: '#9c27b0' },
      { lat: 35.7617, lng: 140.2455, area: '千葉北部・茨城南部', color: '#9c27b0' },
      { lat: 35.8256, lng: 140.1107, area: '千葉北部・茨城南部', color: '#9c27b0' },
      { lat: 35.7817, lng: 140.2817, area: '千葉北部・茨城南部', color: '#9c27b0' },
      { lat: 35.9097, lng: 140.1869, area: '千葉北部・茨城南部', color: '#9c27b0' },
      { lat: 35.8617, lng: 140.2455, area: '千葉北部・茨城南部', color: '#9c27b0' },

      // 群馬・栃木エリア（赤色）
      { lat: 36.3911, lng: 139.0608, area: '群馬・栃木', color: '#f44336' },
      { lat: 36.5658, lng: 139.8836, area: '群馬・栃木', color: '#f44336' },
      { lat: 36.3322, lng: 139.3131, area: '群馬・栃木', color: '#f44336' },
      { lat: 36.4560, lng: 139.6225, area: '群馬・栃木', color: '#f44336' },
      { lat: 36.2180, lng: 139.3431, area: '群馬・栃木', color: '#f44336' },
      { lat: 36.3814, lng: 139.6503, area: '群馬・栃木', color: '#f44336' },
      { lat: 36.4437, lng: 139.6380, area: '群馬・栃木', color: '#f44336' },
      { lat: 36.2658, lng: 139.6201, area: '群馬・栃木', color: '#f44336' },
      { lat: 36.3906, lng: 139.4625, area: '群馬・栃木', color: '#f44336' },
      { lat: 36.5308, lng: 139.7029, area: '群馬・栃木', color: '#f44336' },
      { lat: 36.2478, lng: 139.3424, area: '群馬・栃木', color: '#f44336' },
      { lat: 36.3622, lng: 139.4700, area: '群馬・栃木', color: '#f44336' }
    ];
  }

  private addDeliveryPointsToMap(L: any) {
    if (!this.map) return;

    this.deliveryPoints.forEach(point => {
      const marker = L.circleMarker([point.lat, point.lng], {
        color: point.color,
        fillColor: point.color,
        fillOpacity: 0.8,
        radius: 6
      }).addTo(this.map);

      marker.bindPopup(`
        <div style="color: #333;">
          <strong>${point.area}エリア</strong><br>
          配送ポイント<br>
          緯度: ${point.lat}<br>
          経度: ${point.lng}
        </div>
      `);
    });
  }

  private showMapError() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      mapElement.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: #2a2a2a;
          color: #ffffff;
          border-radius: 8px;
          border: 2px solid #444;
          flex-direction: column;
          gap: 10px;
        ">
          <div style="font-size: 48px;">🗺️</div>
          <div style="font-size: 18px; font-weight: bold;">地図を読み込み中...</div>
          <div style="font-size: 14px; color: #cccccc;">
            地図の表示に問題が発生しました。<br>
            しばらくお待ちいただくか、ページを再読み込みしてください。
          </div>
        </div>
      `;
    }
  }

  backToPortal() {
    this.router.navigate(['/portal']);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
