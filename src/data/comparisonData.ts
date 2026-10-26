export interface ValveFamilyComparison {
  name: string;
  nameEn: string;
  shutoffPerformance: string; // Rate A, Class IV, etc.
  shutoffPerformanceEn: string;
  throttlingAbility: string; // Tốt, Kém, Tuyệt vời
  throttlingAbilityEn: string;
  pressureDrop: string; // Rất thấp, Trung bình, Cao
  pressureDropEn: string;
  speed: string; // 90° Nhanh, Chậm nhiều vòng
  speedEn: string;
  costFactor: string; // Trung bình, Tiết kiệm, Cao
  costFactorEn: string;
  bestFor: string[];
  bestForEn: string[];
  limitations: string;
  limitationsEn: string;
  recommendedDN: string;
}

export const VALVE_COMPARISONS: Record<string, ValveFamilyComparison> = {
  ball: {
    name: 'Van Bi (Ball Valve)',
    nameEn: 'Ball Valve',
    shutoffPerformance: 'ISO 5208 Rate A (Kín tuyệt đối 100%)',
    shutoffPerformanceEn: 'ISO 5208 Rate A (Zero Bubble-Tight 100%)',
    throttlingAbility: 'Hạn chế (Chủ yếu ON/OFF, trừ bi chữ V)',
    throttlingAbilityEn: 'Limited (Primarily ON/OFF, except V-notch)',
    pressureDrop: 'Cực thấp (Full bore gần như bằng 0)',
    pressureDropEn: 'Extremely Low (Full bore near zero drop)',
    speed: 'Rất nhanh (Góc quay 90° tay gạt/khí nén)',
    speedEn: 'Very Fast (90° quarter-turn lever/actuator)',
    costFactor: 'Trung bình - Cao (Tùy vật liệu Inox)',
    costFactorEn: 'Medium to High (Depends on metallurgy)',
    bestFor: ['Nước sạch', 'Khí nén', 'Khí Gas LPG', 'Hóa chất', 'Dầu'],
    bestForEn: ['Clean Water', 'Gas/LPG', 'Compressed Air', 'Chemicals', 'Petrochemical'],
    limitations: 'Không phù hợp lưu chất đặc có bùn cát lớn dễ làm xước bi',
    limitationsEn: 'Not recommended for heavy slurries that can score the ball',
    recommendedDN: 'DN15 - DN250'
  },
  butterfly: {
    name: 'Van Bướm (Butterfly Valve)',
    nameEn: 'Butterfly Valve',
    shutoffPerformance: 'ISO 5208 Rate A (Kín 2 chiều với gioăng EPDM/PTFE)',
    shutoffPerformanceEn: 'ISO 5208 Rate A (Bi-directional bubble-tight EPDM/PTFE)',
    throttlingAbility: 'Khá tốt (Từ góc mở 30° đến 70°)',
    throttlingAbilityEn: 'Good (Linear throttling from 30° to 70°)',
    pressureDrop: 'Thấp - Trung bình (Đĩa van nằm trong dòng chảy)',
    pressureDropEn: 'Low to Medium (Disc resides in flow path)',
    speed: 'Nhanh (Quay 90° tay gạt hoặc hộp số)',
    speedEn: 'Fast (Quarter-turn lever or worm gear)',
    costFactor: 'Rất kinh tế (Chi phí rẻ nhất cho size lớn)',
    costFactorEn: 'Highly Economical (Lowest cost for large diameters)',
    bestFor: ['Cấp thoát nước', 'HVAC Chiller', 'PCCC', 'Đường ống size lớn DN100 - DN1000'],
    bestForEn: ['Water Supply', 'HVAC Cooling', 'Fire Fighting', 'Large Diameter Pipes'],
    limitations: 'Đĩa van luôn nằm trong dòng chảy nên cản trở nhẹ lưu lượng',
    limitationsEn: 'Disc is always in the flow stream, creating slight turbulence',
    recommendedDN: 'DN50 - DN1200+'
  },
  gate: {
    name: 'Van Cổng (Gate Valve)',
    nameEn: 'Gate Valve',
    shutoffPerformance: 'API 598 Metallic Seat (Rất kín khi đóng)',
    shutoffPerformanceEn: 'API 598 Metallic / Resilient Wedge (Tight shutoff)',
    throttlingAbility: 'Kém (Nghiêm cấm dùng để điều tiết - gây rung lắc nêm)',
    throttlingAbilityEn: 'Poor (Prohibited for throttling - causes chatter & erosion)',
    pressureDrop: 'Bằng 0 khi mở hết (Dòng chảy thẳng thông suốt)',
    pressureDropEn: 'Zero when fully open (Straight unobstructed flow)',
    speed: 'Chậm (Cần quay nhiều vòng vô lăng, tránh búa nước)',
    speedEn: 'Slow (Multi-turn handwheel prevents water hammer)',
    costFactor: 'Hợp lý cho áp cao và size vừa đến lớn',
    costFactorEn: 'Moderate for high pressure and medium-to-large sizes',
    bestFor: ['Đường ống chính nước thô', 'Dầu thô', 'Hơi bão hòa', 'Xăng dầu'],
    bestForEn: ['Raw Water Mainlines', 'Crude Oil', 'Steam Systems', 'Refining'],
    limitations: 'Đóng mở lâu, chiều cao tổng thể lớn, không được mở hé',
    limitationsEn: 'Slow actuation, requires high vertical headroom, zero throttling',
    recommendedDN: 'DN50 - DN800'
  },
  check: {
    name: 'Van Một Chiều (Check Valve)',
    nameEn: 'Check Valve (Non-Return)',
    shutoffPerformance: 'Tự động đóng kín khi có xu hướng chảy ngược',
    shutoffPerformanceEn: 'Automatic tight closure on backflow tendency',
    throttlingAbility: 'Không áp dụng (Hoạt động hoàn toàn tự động)',
    throttlingAbilityEn: 'Not Applicable (Purely automatic non-return action)',
    pressureDrop: 'Phụ thuộc áp lực mở thắng lực lò xo / đối trọng',
    pressureDropEn: 'Dependent on spring/disc cracking pressure',
    speed: 'Tức thời (Phản hồi tự động dưới 0.2 giây)',
    speedEn: 'Instantaneous (Sub-0.2s automatic closure)',
    costFactor: 'Kinh tế, bảo trì thấp',
    costFactorEn: 'Economical, low maintenance',
    bestFor: ['Bảo vệ đầu đẩy máy bơm', 'Ngăn chảy ngược đường ống', 'Hệ thống chiller'],
    bestForEn: ['Pump Discharge Protection', 'Backflow Prevention', 'Condenser Lines'],
    limitations: 'Cần tính toán lưu lượng tối thiểu để đĩa van mở ổn định',
    limitationsEn: 'Requires minimum velocity to fully open and stabilize the disc',
    recommendedDN: 'DN50 - DN600'
  },
  globe: {
    name: 'Van Cầu (Globe Valve)',
    nameEn: 'Globe Valve',
    shutoffPerformance: 'Rất cao (Lực ép vuông góc lên mặt ghế van)',
    shutoffPerformanceEn: 'Very High (Perpendicular seating thrust)',
    throttlingAbility: 'Tốt nhất (Điều tiết lưu lượng tuyến tính chính xác)',
    throttlingAbilityEn: 'Superior (Precise linear throttling and control)',
    pressureDrop: 'Cao nhất (Dòng chảy đổi hướng hình chữ S)',
    pressureDropEn: 'Highest (Internal S-shaped tortuous flow path)',
    speed: 'Chậm (Nhiều vòng quay vô lăng tay)',
    speedEn: 'Slow (Multi-turn stem actuation)',
    costFactor: 'Cao (Do khối lượng vật liệu lớn và gia công phức tạp)',
    costFactorEn: 'High (Heavy metallurgy and complex casting)',
    bestFor: ['Lò hơi hơi nóng', 'Hơi quá nhiệt', 'Dầu truyền nhiệt', 'Điều chỉnh áp suất'],
    bestForEn: ['Steam Boilers', 'Superheated Steam', 'Thermal Oil', 'Pressure Throttling'],
    limitations: 'Tổn hao áp lực lớn hơn các loại van khác',
    limitationsEn: 'Highest pressure drop due to the internal S-shaped path',
    recommendedDN: 'DN15 - DN300'
  }
};
