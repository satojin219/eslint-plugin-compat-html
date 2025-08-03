import React, { useState } from "react";

const OldBrowserComponent: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Use modern fetch API
    try {
      const response = await fetch("/api/submit");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>古いブラウザ対応テスト</h1>

      {/* HTML5 semantic elements */}
      <main>
        <section>
          <article>
            <header>
              <h2>記事タイトル</h2>
              <time dateTime="2023-01-01">2023年1月1日</time>
            </header>

            <p>この記事はHTML5のセマンティック要素を使用しています。</p>

            <figure>
              <img src="example.jpg" alt="例の画像" />
              <figcaption>画像の説明</figcaption>
            </figure>

            <footer>
              <address>
                作成者: <a href="mailto:author@example.com">作成者</a>
              </address>
            </footer>
          </article>
        </section>

        <aside>
          <nav>
            <h3>ナビゲーション</h3>
            <ul>
              <li>
                <a href="#section1">セクション1</a>
              </li>
              <li>
                <a href="#section2">セクション2</a>
              </li>
            </ul>
          </nav>
        </aside>
      </main>

      {/* Modern form elements */}
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>ユーザー情報</legend>

          <label>
            メール:
            <input type="email" required />
          </label>

          <label>
            ウェブサイト:
            <input type="url" />
          </label>

          <label>
            電話番号:
            <input type="tel" />
          </label>

          <label>
            検索:
            <input type="search" placeholder="検索..." />
          </label>

          <label>
            生年月日:
            <input type="date" />
          </label>

          <label>
            時間:
            <input type="time" />
          </label>

          <label>
            月:
            <input type="month" />
          </label>

          <label>
            週:
            <input type="week" />
          </label>

          <label>
            数値:
            <input type="number" min="0" max="100" />
          </label>

          <label>
            範囲:
            <input type="range" min="0" max="100" defaultValue="50" />
          </label>

          <label>
            色:
            <input type="color" defaultValue="#ff0000" />
          </label>

          <button type="submit">送信</button>
        </fieldset>
      </form>

      {/* Interactive elements */}
      <details>
        <summary>詳細を表示</summary>
        <p>ここに詳細情報が表示されます。</p>
      </details>

      <button onClick={() => setShowDialog(true)}>ダイアログを開く</button>

      {showDialog && (
        <dialog open>
          <h3>ダイアログ</h3>
          <p>これはダイアログ要素です。</p>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button onClick={() => setShowDialog(false)}>閉じる</button>
        </dialog>
      )}

      <meter value="70" min="0" max="100">
        70%
      </meter>
      <progress value="60" max="100">
        60%
      </progress>

      <output>計算結果: 42</output>

      {/* Very modern elements and attributes */}
      <div popover="auto" id="my-popover">
        <p>This is a popover element (Chrome 114+)</p>
      </div>
      
      <input type="datetime-local" />
      
      {/* Web Components */}
      <slot name="content"></slot>
      
      {/* Modern attributes */}
      <div contentEditable="true" spellCheck="true">
        編集可能なコンテンツ
      </div>
      
      <img src="example.jpg" alt="example" loading="lazy" decoding="async" />
      
      <input type="text" inputMode="numeric" />
      
      <video controls>
        <source src="video.mp4" type="video/mp4" />
        <track kind="captions" src="captions.vtt" srcLang="ja" />
      </video>
      
      <audio controls>
        <source src="audio.mp3" type="audio/mp3" />
      </audio>
      
      {/* Safari specific issues */}
      <input type="date" step="1" />
      
      {/* Older Firefox issues */}
      <input type="color" list="colors" />
      <datalist id="colors">
        <option value="#ff0000" />
        <option value="#00ff00" />
        <option value="#0000ff" />
      </datalist>
    </div>
  );
};

export default OldBrowserComponent;


