import { Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';

interface Warehouse {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
}

interface DeliveryPoint {
  id: string;
  lat: number;
  lng: number;
  address: string;
  customerName: string;
  area?: number;
  color?: string;
}

@Component({
  selector: 'app-delivery-planning',
  imports: [CommonModule],
  templateUrl: './delivery-planning.html',
  styleUrl: './delivery-planning.css'
})
export class DeliveryPlanningComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: any;
  private deliveryMarkers: any[] = [];
  private warehouseMarker: any;
  
  selectedWarehouse: Warehouse | null = null;
  deliveryPoints: DeliveryPoint[] = [];
  isAreaDivided = false;
  
  warehouses: Warehouse[] = [
    { id: 'matsudo', name: '松戸倉庫', location: '千葉', lat: 35.7873, lng: 139.9025 },
    { id: 'utsunomiya', name: '宇都宮倉庫', location: '栃木', lat: 36.5658, lng: 139.8836 },
    { id: 'mito', name: '水戸倉庫', location: '茨城', lat: 36.3414, lng: 140.4467 },
    { id: 'yokohama', name: '横浜倉庫', location: '神奈川', lat: 35.4437, lng: 139.6380 },
    { id: 'suginami', name: '杉並倉庫', location: '東京', lat: 35.6995, lng: 139.6362 },
    { id: 'urawa', name: '浦和倉庫', location: '埼玉', lat: 35.8617, lng: 139.6455 }
  ];

  areaColors = ['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#f44336'];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // 初期化処理
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

    } catch (error) {
      console.error('地図の初期化に失敗しました:', error);
      this.showMapError();
    }
  }

  onWarehouseSelect(warehouse: Warehouse) {
    this.selectedWarehouse = warehouse;
    this.isAreaDivided = false;
    this.generateDeliveryPoints(warehouse);
    this.updateMap();
  }

  private generateDeliveryPoints(warehouse: Warehouse) {
    // 選択された倉庫周辺に50個の配送地点を生成
    this.deliveryPoints = [];
    const baseNames = [
      '田中商店', '佐藤工業', '山田電機', '鈴木商事', '高橋製作所',
      '渡辺運輸', '伊藤食品', '中村建設', '小林商会', '加藤製薬',
      '吉田商店', '山本工業', '松本電機', '井上商事', '木村製作所',
      '林運輸', '清水食品', '山口建設', '森商会', '池田製薬'
    ];

    for (let i = 0; i < 50; i++) {
      // 倉庫から半径20km以内にランダムに配送地点を生成
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 0.18; // 約20km
      
      const lat = warehouse.lat + (distance * Math.cos(angle));
      const lng = warehouse.lng + (distance * Math.sin(angle));
      
      const customerName = baseNames[i % baseNames.length] + (Math.floor(i / baseNames.length) + 1);
      
      this.deliveryPoints.push({
        id: `delivery_${i + 1}`,
        lat: lat,
        lng: lng,
        address: `配送先${i + 1}`,
        customerName: customerName
      });
    }
  }

  private async updateMap() {
    if (!this.map || !isPlatformBrowser(this.platformId)) return;

    try {
      const leafletModule = await import('leaflet');
      const L = leafletModule.default || leafletModule;

      // 既存のマーカーをクリア
      this.clearMarkers();

      if (this.selectedWarehouse) {
        // 倉庫マーカーを追加
        this.warehouseMarker = L.marker([this.selectedWarehouse.lat, this.selectedWarehouse.lng], {
          icon: L.divIcon({
            html: '🏢',
            iconSize: [30, 30],
            className: 'warehouse-icon'
          })
        }).addTo(this.map);

        this.warehouseMarker.bindPopup(`
          <div style="color: #333;">
            <strong>${this.selectedWarehouse.name}</strong><br>
            ${this.selectedWarehouse.location}
          </div>
        `);

        // 配送地点マーカーを追加
        this.deliveryPoints.forEach(point => {
          const color = point.color || '#666666';
          const marker = L.circleMarker([point.lat, point.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.8,
            radius: 5
          }).addTo(this.map);

          marker.bindPopup(`
            <div style="color: #333;">
              <strong>${point.customerName}</strong><br>
              ${point.address}<br>
              ${point.area ? `エリア${point.area}` : '未分割'}
            </div>
          `);

          this.deliveryMarkers.push(marker);
        });

        // 地図の表示範囲を調整
        const group = L.featureGroup([this.warehouseMarker, ...this.deliveryMarkers]);
        this.map.fitBounds(group.getBounds().pad(0.1));
      }
    } catch (error) {
      console.error('地図の更新に失敗しました:', error);
    }
  }

  private clearMarkers() {
    // 配送地点マーカーをクリア
    this.deliveryMarkers.forEach(marker => {
      if (this.map) {
        this.map.removeLayer(marker);
      }
    });
    this.deliveryMarkers = [];

    // 倉庫マーカーをクリア
    if (this.warehouseMarker && this.map) {
      this.map.removeLayer(this.warehouseMarker);
      this.warehouseMarker = null;
    }
  }

  divideIntoAreas() {
    if (!this.selectedWarehouse || this.deliveryPoints.length === 0) return;

    // K-meansクラスタリングのシンプルな実装で5エリアに分割
    const k = 5;
    const points = this.deliveryPoints.map(p => [p.lat, p.lng]);
    const clusters = this.kMeansClustering(points, k);

    // 各配送地点にエリアと色を割り当て
    this.deliveryPoints.forEach((point, index) => {
      point.area = clusters[index] + 1;
      point.color = this.areaColors[clusters[index]];
    });

    this.isAreaDivided = true;
    this.updateMap();
  }

  private kMeansClustering(points: number[][], k: number): number[] {
    // シンプルなK-meansクラスタリング実装
    const centroids: number[][] = [];
    
    // 初期重心をランダムに選択
    for (let i = 0; i < k; i++) {
      const randomIndex = Math.floor(Math.random() * points.length);
      centroids.push([...points[randomIndex]]);
    }

    let assignments = new Array(points.length).fill(0);
    let changed = true;
    let iterations = 0;

    while (changed && iterations < 100) {
      changed = false;
      iterations++;

      // 各点を最も近い重心に割り当て
      for (let i = 0; i < points.length; i++) {
        let minDistance = Infinity;
        let newAssignment = 0;

        for (let j = 0; j < k; j++) {
          const distance = this.euclideanDistance(points[i], centroids[j]);
          if (distance < minDistance) {
            minDistance = distance;
            newAssignment = j;
          }
        }

        if (assignments[i] !== newAssignment) {
          assignments[i] = newAssignment;
          changed = true;
        }
      }

      // 重心を更新
      for (let j = 0; j < k; j++) {
        const clusterPoints = points.filter((_, i) => assignments[i] === j);
        if (clusterPoints.length > 0) {
          centroids[j] = [
            clusterPoints.reduce((sum, p) => sum + p[0], 0) / clusterPoints.length,
            clusterPoints.reduce((sum, p) => sum + p[1], 0) / clusterPoints.length
          ];
        }
      }
    }

    return assignments;
  }

  private euclideanDistance(point1: number[], point2: number[]): number {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  getAreaCount(areaNumber: number): number {
    return this.deliveryPoints.filter(point => point.area === areaNumber).length;
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
