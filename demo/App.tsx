import type React from 'react';

interface UserProps {
  name: string;
  age?: number;
}

const UserCard: React.FC<UserProps> = ({ name, age }) => {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      {age && <p>年齢: {age}歳</p>}
      
      {/* Modern HTML elements that might have compatibility issues */}
      <dialog open>
        <p>ユーザー情報ダイアログ</p>
        <button onClick={() => console.log('Close clicked')}>閉じる</button>
      </dialog>
      
      <details>
        <summary>詳細情報</summary>
        <p>このユーザーの詳細情報です。</p>
        <time dateTime="2023-01-01">2023年1月1日</time>
      </details>
      
      <form>
        <input type="email" placeholder="メールアドレス" />
        <input type="tel" placeholder="電話番号" />
        <input type="date" defaultValue="2023-01-01" />
        <input type="color" defaultValue="#ff0000" />
        <input type="range" min="0" max="100" defaultValue="50" />
      </form>
    </div>
  );
};

const App: React.FC = () => {
  const users = [
    { name: '田中太郎', age: 25 },
    { name: '佐藤花子', age: 30 },
    { name: '山田次郎' }
  ];

  const handleClick = () => {
    // Modern JavaScript features
    const foundUser = users.find(user => user.age && user.age > 25);
    console.log(foundUser?.name ?? 'ユーザーが見つかりません');
  };

  return (
    <div className="app">
      <header>
        <h1>ユーザー管理アプリ</h1>
        <nav>
          <ul>
            <li><a href="#home">ホーム</a></li>
            <li><a href="#users">ユーザー</a></li>
          </ul>
        </nav>
      </header>
      
      <main>
        <section>
          <h2>ユーザー一覧</h2>
          {users.map((user, index) => (
            <UserCard key={index} name={user.name} age={user.age} />
          ))}
        </section>
        
        <aside>
          <article>
            <h3>サイドバー</h3>
            <p>追加情報をここに表示します。</p>
            <button onClick={handleClick}>ユーザー検索</button>
          </article>
        </aside>
      </main>
      
      <footer>
        <p>&copy; 2023 ユーザー管理システム</p>
      </footer>
    </div>
  );
};

export default App;
