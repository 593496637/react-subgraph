/**
 * 十六进制与字符串转换工具函数
 * 支持中文、emoji等多字节字符的编码和解码
 */

/**
 * 字符串转十六进制（支持中文、emoji等）
 * @param str 要转换的字符串
 * @returns 十六进制字符串，以0x开头
 */
export function str2hex(str: string): string {
  if (!str) return '';
  const arr = ['0x'];
  for (let i = 0; i < str.length; i++) {
    const codePoint = str.codePointAt(i);
    if (codePoint && codePoint > 0xffff) {
      i++; // 跳过代理对的下一个
    }
    if (codePoint) {
      arr.push(codePoint.toString(16).padStart(4, '0')); // 用4位16进制表示
    }
  }
  return arr.join('');
}

/**
 * 十六进制转字符串（支持中文、emoji等）
 * @param hex 十六进制字符串
 * @returns 解码后的字符串
 */
export function hex2str(hex: string): string {
  if (!hex) return '';
  
  let rawStr = hex.trim();
  if (rawStr.startsWith('0x')) {
    rawStr = rawStr.slice(2);
  }

  // 如果是空字符串，返回空
  if (rawStr.length === 0) return '';

  // 检查长度是否为4的倍数
  if (rawStr.length % 4 !== 0) {
    // 如果不是4的倍数，可能是标准的交易输入数据，尝试按2位解析
    return parseStandardHex(rawStr);
  }

  try {
    const result = [];
    for (let i = 0; i < rawStr.length; i += 4) {
      const codePoint = parseInt(rawStr.slice(i, i + 4), 16);
      if (codePoint === 0) break; // 遇到null终止符停止
      result.push(String.fromCodePoint(codePoint));
    }
    return result.join('');
  } catch (error) {
    console.log(error)
    // 如果解析失败，返回原始十六进制字符串
    return `0x${rawStr}`;
  }
}

/**
 * 解析标准的十六进制数据（按字节解析）
 * @param hexStr 不含0x前缀的十六进制字符串
 * @returns 解码后的字符串或原始十六进制
 */
function parseStandardHex(hexStr: string): string {
  try {
    const result = [];
    for (let i = 0; i < hexStr.length; i += 2) {
      const byte = parseInt(hexStr.slice(i, i + 2), 16);
      if (byte === 0) break; // 遇到null终止符停止
      if (byte >= 32 && byte <= 126) { // 可打印ASCII字符
        result.push(String.fromCharCode(byte));
      }
    }
    
    // 如果解析出的字符串长度合理，返回解析结果，否则返回截断的十六进制
    if (result.length > 0 && result.length < 100) {
      return result.join('');
    }
    
    return `0x${hexStr.substring(0, 20)}...`;
  } catch (error) {
    console.log(error)
    return `0x${hexStr.substring(0, 20)}...`;
  }
}

/**
 * 智能解析十六进制字符串为可读文本
 * 如果无法解析为有效字符串，返回截断的十六进制
 * @param hex 十六进制字符串
 * @returns 解析后的字符串或截断的十六进制
 */
export function parseHexMessage(hex: string): string {
  if (!hex || hex === '0x') return '无数据';
  
  const decoded = hex2str(hex);
  
  // 如果解析后的字符串以0x开头，说明解析失败，显示截断版本
  if (decoded.startsWith('0x')) {
    return decoded;
  }
  
  // 如果解析成功且内容合理，显示解析结果
  if (decoded && decoded.length > 0 && decoded.length < 200) {
    return decoded;
  }
  
  // 否则显示截断的十六进制
  return `${hex.substring(0, 22)}...`;
}