import { ValveProduct, ValveCharacteristics, CustomCharacteristic } from '../types/valve';

/**
 * AI Characteristic Synthesizer for Industrial Valves.
 * Analyzes mechanical specifications, metallurgies, pressure ratings,
 * standards and operating environments to synthesize lifecycle, temperature thresholds,
 * sealing integrity, media compatibility, and technical recommendations.
 */
export function synthesizeValveCharacteristics(
  valve: Partial<ValveProduct>
): ValveCharacteristics {
  const cat = (valve.category || '').toLowerCase();
  const sys = (valve.systemGroup || 'water').toLowerCase();
  const mat = (valve.material || '').toLowerCase();
  const matEn = (valve.materialEn || '').toLowerCase();
  const press = (valve.pressure || 'PN16').toUpperCase();
  const temp = valve.tempRange || '-20°C đến 120°C';
  const brand = valve.brand || 'UTD';

  let lifecycle = '500,000 chu trình đóng/mở • Tuổi thọ thiết kế 15-20 năm';
  let lifecycleEn = '500,000 operational cycles • 15-20 years design life';

  let sealIntegrity = 'ISO 5208 Rate A (Bubble-Tight) • Zero Leakage';
  let sealIntegrityEn = 'ISO 5208 Rate A (Bubble-Tight) • Zero Leakage';

  let tempLimits = temp;
  let tempLimitsEn = temp;

  let mediaApplications = (valve.applicableMedia && valve.applicableMedia.length > 0)
    ? valve.applicableMedia.join(', ')
    : 'Nước sạch, Nước làm mát Chiller, Nước ngưng';
  let mediaApplicationsEn = (valve.applicableMediaEn && valve.applicableMediaEn.length > 0)
    ? valve.applicableMediaEn.join(', ')
    : 'Potable water, Chilled cooling water, Condensate';

  let aiSummaryNotes = 'Van được thiết kế tối ưu thủy lực học, giảm tổn thất áp suất (low pressure drop), vật liệu đúc chống xâm thực bề mặt.';
  let aiSummaryNotesEn = 'Hydrodynamically optimized valve body minimizes pressure drop with cavitation-resistant metallurgical trim.';

  // Domain-specific heuristic synthesis based on valve engineering
  if (sys === 'firefighting' || cat.includes('fire') || valve.code?.includes('AV-1') || valve.code?.includes('DV-5') || valve.code?.includes('BFV-300')) {
    lifecycle = '100,000 chu trình kích hoạt khẩn cấp • Độ bền cơ học >25 năm';
    lifecycleEn = '100,000 emergency actuation cycles • >25 years mechanical durability';
    sealIntegrity = 'UL / FM Certified Tight Shutoff • Không rò rỉ áp suất tĩnh';
    sealIntegrityEn = 'UL / FM Certified Tight Shutoff • Zero static pressure bypass';
    tempLimits = '0°C đến +68°C (Theo chuẩn PCCC NFPA 13 / 15 / 16)';
    tempLimitsEn = '0°C to +68°C (NFPA 13 / 15 / 16 Fire Standard)';
    mediaApplications = 'Nước chữa cháy, Bọt foam AFFF, Hệ thống xả tràn Sprinkler/Deluge';
    mediaApplicationsEn = 'Fire water, AFFF Foam solution, Sprinkler & Deluge open head loops';
    aiSummaryNotes = 'Thiết kế phản ứng tức thời < 0.2s khi kích hoạt báo cháy, vỏ gang cầu chịu va đập búa nước (Water Hammer Protection).';
    aiSummaryNotesEn = 'Instantaneous actuation (<0.2s) upon fire trip, ductile iron shell withstands severe water hammer surges.';
  } else if (sys === 'steam' || cat === 'prv' || cat === 'safety_valve' || mat.includes('wcb') || mat.includes('thép')) {
    lifecycle = '800,000 chu trình • Hoạt động liên tục 24/7 trong môi trường hơi nhiệt cao';
    lifecycleEn = '800,000 cycles • 24/7 continuous operation in harsh thermal loops';
    sealIntegrity = mat.includes('stellite') || mat.includes('metal')
      ? 'ANSI Class IV / V (Metal-to-Metal Hardfacing Stellite Gr.6)'
      : 'ISO 5208 Rate B / EN 12266-1 kín tuyệt đối hơi bão hòa';
    sealIntegrityEn = mat.includes('stellite') || mat.includes('metal')
      ? 'ANSI Class IV / V (Stellite Gr.6 hardfaced metal seat)'
      : 'ISO 5208 Rate B / EN 12266-1 saturated steam tight';
    tempLimits = temp.includes('°C') ? temp : '-20°C đến +425°C (Hơi quá nhiệt)';
    tempLimitsEn = temp.includes('°C') ? temp : '-20°C to +425°C (Superheated Steam)';
    mediaApplications = 'Hơi nóng bão hòa (Steam), Hơi quá nhiệt, Dầu truyền nhiệt (Thermal Oil)';
    mediaApplicationsEn = 'Saturated steam, Superheated steam, Thermal transfer oil';
    aiSummaryNotes = 'Đĩa van tôi cứng bề mặt chống xói mòn hơi cao tốc, bellows seal hoặc packing graphite chịu nhiệt loại bỏ rò rỉ khí thải.';
    aiSummaryNotesEn = 'Hardened trim resists high-velocity steam wire-drawing; graphite/bellows packing completely eliminates fugitive emissions.';
  } else if (cat === 'balancing' || (valve.name && valve.name.toLowerCase().includes('picv')) || valve.code?.includes('VP1000') || valve.code?.includes('VG')) {
    lifecycle = '1,200,000 chu trình điều tiết liên tục • Động cơ chấp hành Modulating 24V';
    lifecycleEn = '1,200,000 modulating cycles • Continuous BACnet/Modbus actuator control';
    sealIntegrity = 'ANSI Class IV (0.01% Kvs) • Đóng chặt hoàn toàn khi cắt tải';
    sealIntegrityEn = 'ANSI Class IV (0.01% Kvs) • Tight shut-off under zero load';
    tempLimits = '-10°C đến +120°C (Dung dịch Glycol 50% & Chilled Water)';
    tempLimitsEn = '-10°C to +120°C (Water & 50% Ethylene/Propylene Glycol)';
    mediaApplications = 'Nước lạnh Chiller HVAC, Nước nóng Boiler điều hòa, Glycol 50%';
    mediaApplicationsEn = 'HVAC Chilled water, FCU/AHU heating water, Glycol mix';
    aiSummaryNotes = 'Tích hợp tự động cân bằng chênh áp độc lập (PICV), độ chính xác lưu lượng ±5%, tiết kiệm đến 30% điện năng bơm tuần hoàn.';
    aiSummaryNotesEn = 'Built-in differential pressure controller (PICV), ±5% flow accuracy, up to 30% chiller pumping energy savings.';
  } else if (cat === 'knife_gate' || mat.includes('dao')) {
    lifecycle = '300,000 chu trình cắt • Lưỡi dao Inox 316 mài vát tự làm sạch rác';
    lifecycleEn = '300,000 shearing cycles • Self-cleaning beveled SS316 gate blade';
    sealIntegrity = 'MSS SP-81 / ISO 5208 Rate A (Bít kín 2 chiều Bi-directional)';
    sealIntegrityEn = 'MSS SP-81 / ISO 5208 Rate A (Bi-directional bubble-tight shutoff)';
    tempLimits = '-20°C đến +150°C (EPDM / PTFE seat)';
    tempLimitsEn = '-20°C to +150°C (EPDM / PTFE seat)';
    mediaApplications = 'Bùn cát khoáng sản, Bột giấy nồng độ cao, Nước thải công nghiệp, Hạt nhựa';
    mediaApplicationsEn = 'Pulp & paper stock, Mineral slurries, Waste water, Fly ash & polymers';
    aiSummaryNotes = 'Khoang thân không túi đọng (zero-cavity), lưỡi dao tự cắt xơ sợi khi đóng, chống tắc nghẽn đường ống.';
    aiSummaryNotesEn = 'Pocketless cavity prevents sedimentation; sharp beveled knife slices through suspended solids and fibers effortlessly.';
  } else if (cat === 'butterfly' && (valve.isHighPerformance || (valve.name && valve.name.toLowerCase().includes('lệch tâm')))) {
    lifecycle = '1,000,000 chu trình đóng mở • Đĩa lệch tâm 3 không ma sát góc xoay';
    lifecycleEn = '1,000,000 operational cycles • Frictionless triple-offset geometry';
    sealIntegrity = 'ISO 5208 Rate A (Bubble-Tight cả 2 chiều) • API 607 Fire Safe';
    sealIntegrityEn = 'ISO 5208 Rate A (Bi-directional bubble-tight) • API 607 Fire Safe';
    tempLimits = '-196°C (Cryogenic) đến +450°C';
    tempLimitsEn = '-196°C (Cryogenic) to +450°C';
    mediaApplications = 'Khí LNG/LPG, Khí oxy/nitơ hóa lỏng, Hóa chất hữu cơ, Dầu mỏ';
    mediaApplicationsEn = 'LNG/LPG, Cryogenic Liquid O2/N2, Petrochemical hydrocarbons';
    aiSummaryNotes = 'Cơ chế cam lệch tâm 3 loại bỏ ma sát tại bề mặt gioăng kim loại, tuổi thọ gấp 5 lần van bướm thông thường.';
    aiSummaryNotesEn = 'Triple-eccentric camming action eliminates seal rubbing until final seating, delivering 5x lifespan over standard valves.';
  }

  const customAttributes: CustomCharacteristic[] = [
    {
      id: 'attr-mtbf',
      key: 'Thời gian trung bình giữa 2 sự cố (MTBF)',
      keyEn: 'Mean Time Between Failures (MTBF)',
      value: '> 85,000 giờ vận hành liên tục',
      valueEn: '> 85,000 continuous operating hours',
    },
    {
      id: 'attr-maint',
      key: 'Bảo trì định kỳ',
      keyEn: 'Maintenance Interval',
      value: 'Tự bôi trơn, kiểm tra định kỳ 24-36 tháng',
      valueEn: 'Self-lubricating trim, inspection every 24-36 months',
    },
    {
      id: 'attr-brand',
      key: 'Hãng sản xuất / Tiêu chuẩn',
      keyEn: 'Manufacturer & Standard',
      value: `${brand} • Đạt chứng nhận kiểm định xuất xưởng 100%`,
      valueEn: `${brand} • 100% Factory Tested & Certified`,
    }
  ];

  return {
    lifecycle,
    lifecycleEn,
    tempLimits,
    tempLimitsEn,
    sealIntegrity,
    sealIntegrityEn,
    mediaApplications,
    mediaApplicationsEn,
    aiSummaryNotes,
    aiSummaryNotesEn,
    customAttributes,
  };
}
