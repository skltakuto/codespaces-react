import React, { useState } from 'react';

const ShoppingListApp = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [newItem, setNewItem] = useState('');

  // 新しいアイテムの追加
  const addItem = (e) => {
    e.preventDefault();
    
    const trimmedItemName = newItem.trim();
    
    if (!trimmedItemName) return;

    // 既存のアイテムがないか確認
    const existingItem = shoppingList.find(
      item => item.name.toLowerCase() === trimmedItemName.toLowerCase()
    );

    if (existingItem) {
      // すでに同じアイテムがある場合は数量を増やす
      setShoppingList(prevList => 
        prevList.map(item => 
          item.name.toLowerCase() === trimmedItemName.toLowerCase()
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // 新しいアイテムを追加
      const newItemObject = { 
        id: Date.now(), 
        name: trimmedItemName, 
        quantity: 1,
        checked: false
      };

      setShoppingList(prevList => [...prevList, newItemObject]);
    }

    // 入力フィールドをクリア
    setNewItem('');
  };

  // アイテムをチェック（買い物かごに入れる）
  const toggleItemCheck = (id, list) => {
    if (list === 'shopping') {
      setShoppingList(prevList => 
        prevList.map(item => 
          item.id === id ? { ...item, checked: !item.checked } : item
        )
      );
    } else {
      setCartList(prevList => 
        prevList.map(item => 
          item.id === id ? { ...item, checked: !item.checked } : item
        )
      );
    }
  };

  // アイテムを買い物かごに移動
  const moveItemToCart = () => {
    const checkedItems = shoppingList.filter(item => item.checked);
    
    if (checkedItems.length > 0) {
      // カートに移動
      setCartList(prevCart => [
        ...prevCart, 
        ...checkedItems.map(item => ({ ...item, checked: false }))
      ]);

      // ショッピングリストから削除
      setShoppingList(prevList => 
        prevList.filter(item => !item.checked)
      );
    }
  };

  // アイテムをショッピングリストに戻す
  const moveItemToShoppingList = () => {
    const checkedItems = cartList.filter(item => item.checked);
    
    if (checkedItems.length > 0) {
      // ショッピングリストに戻す
      setShoppingList(prevList => [
        ...prevList, 
        ...checkedItems.map(item => ({ ...item, checked: false }))
      ]);

      // カートから削除
      setCartList(prevCart => 
        prevCart.filter(item => !item.checked)
      );
    }
  };

  // アイテムの数量増加
  const incrementItem = (id, list) => {
    const setterFunction = list === 'shopping' ? setShoppingList : setCartList;
    
    setterFunction(prevList => 
      prevList.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // アイテムの数量減少
  const decrementItem = (id, list) => {
    const setterFunction = list === 'shopping' ? setShoppingList : setCartList;
    
    setterFunction(prevList => 
      prevList.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(0, item.quantity - 1) } 
          : item
      )
    );
  };

  // アイテムの削除
  const removeItem = (id, list) => {
    const setterFunction = list === 'shopping' ? setShoppingList : setCartList;
    setterFunction(prevList => prevList.filter(item => item.id !== id));
  };

  // 全アイテムのクリア
  const clearList = (list) => {
    const setterFunction = list === 'shopping' ? setShoppingList : setCartList;
    setterFunction([]);
  };

  // リストレンダリング用の共通コンポーネント
  const renderItemList = (items, listType) => (
    items.length > 0 ? (
      <div className="space-y-2">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`flex items-center justify-between p-2 rounded-md ${
              item.checked ? 'bg-green-100' : 'bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              {/* チェックボックス */}
              <input 
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItemCheck(item.id, listType)}
                className="mr-2"
              />

              {/* 数量減少ボタン */}
              <button 
                type="button"
                onClick={() => decrementItem(item.id, listType)}
                className="bg-red-500 text-white w-8 h-8 rounded"
              >
                -
              </button>

              {/* 数量表示 */}
              <span className="font-bold">{item.quantity}</span>

              {/* 数量増加ボタン */}
              <button 
                type="button"
                onClick={() => incrementItem(item.id, listType)}
                className="bg-green-500 text-white w-8 h-8 rounded"
              >
                +
              </button>

              {/* アイテム名 */}
              <span>{item.name}</span>
            </div>

            {/* アイテム削除ボタン */}
            {item.quantity === 0 && (
              <button 
                type="button"
                onClick={() => removeItem(item.id, listType)}
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
        {listType === 'shopping' ? 'ショッピングリスト' : '買い物かご'}は空です
      </p>
    )
  );

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">
        買い物リストアプリ
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

      <div className="flex space-x-4">
        {/* ショッピングリスト */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-2">
            ショッピングリスト
            {shoppingList.length > 0 && (
              <button 
                type="button"
                onClick={clearList}
                className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
              >
                クリア
              </button>
            )}
          </h2>
          {renderItemList(shoppingList, 'shopping')}
          
          {shoppingList.some(item => item.checked) && (
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={moveItemToCart}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                選択したアイテムをカートに入れる
              </button>
            </div>
          )}
        </div>

        {/* 買い物かごリスト */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-2">
            買い物かご
            {cartList.length > 0 && (
              <button 
                type="button"
                onClick={() => clearList('cart')}
                className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
              >
                クリア
              </button>
            )}
          </h2>
          {renderItemList(cartList, 'cart')}
          
          {cartList.some(item => item.checked) && (
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={moveItemToShoppingList}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                選択したアイテムを戻す
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingListApp;