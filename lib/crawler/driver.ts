import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

export async function createDriver() {
  const options = new chrome.Options();

  // 1. 핵심 옵션 설정 (Python 소스의 보안 우회 로직 반영)
  options.addArguments(
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--window-size=1920,1080',
    // 봇 감지 회피: 브라우저 제어 중임을 알리는 플래그를 비활성화
    '--disable-blink-features=AutomationControlled',
    // 실제 사용자의 브라우저인 것처럼 위장
    'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  );

  // 자동화 표시 제거 (navigator.webdriver 값을 false로 만듦)
  options.excludeSwitches('enable-automation');
  options.setLoggingPrefs({ performance: 'ALL' });


  // 2. Headless 설정 (운영 시에는 주석 해제)
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    options.addArguments("--headless=new");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
  }

  console.log("현재 환경:", process.env.NODE_ENV);
  
  

  // 3. 서비스 빌더 (경로가 고정되어 있다면 유지, 없다면 자동 감지 가능하도록 설정)
  // Python의 ChromeDriverManager().install()과 유사한 효과를 위해 경로 확인 필요
  const service = new chrome.ServiceBuilder("C:/drivers/chromedriver.exe");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .setChromeService(service)
    .build();

  // 4. [중요] 봇 감지 회피 스크립트 실행 (Python의 유틸 로직 이식)
  await driver.executeScript(
    "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
  );

  return driver;
}