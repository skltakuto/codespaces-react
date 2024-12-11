import React, { useState } from 'react';

const ShoppingListApp = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  // 新しいアイテムの追加
  const addItem = (e) => {
    e.preventDefault(); // フォームのデフォルト送信を防止
    
    const trimmedItemName = newItem.trim();
    
    if (!trimmedItemName) return;

    // 新しいアイテムを追加
    setItems(prevItems => [
      ...prevItems, 
      { 
        id: Date.now(), 
        name: trimmedItemName, 
        quantity: 1 
      }
    ]);

    // 入力フィールドをクリア
    setNewItem('');
  };

  // アイテムの数量増加
  const incrementItem = (id) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // アイテムの数量減少
  const decrementItem = (id) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(0, item.quantity - 1) } 
          : item
      )
    );
  };

  // アイテムの削除
  const removeItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // 全アイテムのクリア
  const clearAllItems = () => {
    setItems([]);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">
        買い物リスト
      </h1>

      {/* 新規アイテム追加フォーム */}
      <form onSubmit={addItem} className="mb-4 flex">
        <input 
          type="text" 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="アイテムを入力" 
          className="flex-grow p-2 border rounded-l-md"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
        >
          追加
        </button>
      </form>

      {/* アイテムリスト */}
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
            >
              <div className="flex items-center space-x-2">
                {/* 数量減少ボタン */}
                <button 
                  type="button"
                  onClick={() => decrementItem(item.id)}
                  className="bg-red-500 text-white w-8 h-8 rounded"
                >
                  -
                </button>

                {/* 数量表示 */}
                <span className="font-bold">{item.quantity}</span>

                {/* 数量増加ボタン */}
                <button 
                  type="button"
                  onClick={() => incrementItem(item.id)}
                  className="bg-green-500 text-white w-8 h-8 rounded"
                >
                  +
                </button>

                {/* アイテム名 */}
                <span>{item.name}</span>
              </div>

              {/* アイテム削除ボタン（数量0の場合のみ表示） */}
              {item.quantity === 0 && (
                <button 
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  削除
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          リストにアイテムはありません
        </p>
      )}

      {/* 全アイテムクリアボタン */}
      {items.length > 0 && (
        <div className="mt-4 text-center">
          <button 
            type="button"
            onClick={clearAllItems}
            className="bg-red-700 text-white p-2 rounded hover:bg-red-800"
          >
            全てクリア
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingListApp;