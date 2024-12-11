import React, { useState, useRef, useEffect } from 'react';

// ゲームの設定
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PLAYER_SIZE = 20;
const ENEMY_SIZE = 30;
const BULLET_SIZE = 5;
const BULLET_SPEED = 10;
const ENEMY_SPEED = 2;

const ShootingGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('start');

  // ゲーム状態の初期化
  const initializeGame = () => {
    return {
      player: {
        x: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
        y: CANVAS_HEIGHT - PLAYER_SIZE - 10,
      },
      bullets: [],
      enemies: [],
      lastEnemySpawnTime: 0,
    };
  };

  const [game, setGame] = useState(initializeGame());

  // ゲームループ
  const gameLoop = (ctx, timestamp) => {
    if (gameState !== 'playing') return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 弾の更新と描画
    game.bullets.forEach((bullet, index) => {
      bullet.y -= BULLET_SPEED;
      
      // 画面外の弾を削除
      if (bullet.y < 0) {
        game.bullets.splice(index, 1);
      }
      
      ctx.fillStyle = 'yellow';
      ctx.fillRect(bullet.x, bullet.y, BULLET_SIZE, BULLET_SIZE);
    });

    // 敵の更新と描画
    game.enemies.forEach((enemy, enemyIndex) => {
      enemy.y += ENEMY_SPEED;
      
      // 画面下に到達した敵を削除
      if (enemy.y > CANVAS_HEIGHT) {
        game.enemies.splice(enemyIndex, 1);
        return;
      }
      
      ctx.fillStyle = 'red';
      ctx.fillRect(enemy.x, enemy.y, ENEMY_SIZE, ENEMY_SIZE);

      // 当たり判定
      game.bullets.forEach((bullet, bulletIndex) => {
        if (
          bullet.x < enemy.x + ENEMY_SIZE &&
          bullet.x + BULLET_SIZE > enemy.x &&
          bullet.y < enemy.y + ENEMY_SIZE &&
          bullet.y + BULLET_SIZE > enemy.y
        ) {
          // 敵と弾の衝突
          game.bullets.splice(bulletIndex, 1);
          game.enemies.splice(enemyIndex, 1);
          setScore(prevScore => prevScore + 10);
        }
      });
    });

    // 敵の自動生成
    const currentTime = Date.now();
    if (currentTime - game.lastEnemySpawnTime > 1000) {
      game.enemies.push({
        x: Math.random() * (CANVAS_WIDTH - ENEMY_SIZE),
        y: -ENEMY_SIZE,
      });
      game.lastEnemySpawnTime = currentTime;
    }

    // プレイヤーの描画
    ctx.fillStyle = 'green';
    ctx.fillRect(
      game.player.x, 
      game.player.y, 
      PLAYER_SIZE, 
      PLAYER_SIZE
    );

    // ゲームオーバーチェック
    const isGameOver = game.enemies.some(
      enemy => enemy.y + ENEMY_SIZE > game.player.y
    );

    if (isGameOver) {
      setGameState('gameOver');
      return;
    }

    // 次のアニメーションフレーム
    if (gameState === 'playing') {
      requestAnimationFrame((ts) => gameLoop(ctx, ts));
    }
  };

  // ゲームループの開始
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (gameState === 'playing') {
      requestAnimationFrame((timestamp) => gameLoop(ctx, timestamp));
    }
  }, [gameState]);

  // クリックイベントハンドラ
  const handleClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;

    if (gameState === 'start') {
      setGameState('playing');
      return;
    }

    if (gameState === 'playing') {
      // 弾の発射
      game.bullets.push({
        x: mouseX - BULLET_SIZE / 2,
        y: game.player.y,
      });
    }

    if (gameState === 'gameOver') {
      // ゲームリセット
      setGame(initializeGame());
      setScore(0);
      setGameState('start');
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleClick}
        className="border-2 border-gray-500"
      />
      <div className="mt-4 text-xl font-bold">
        スコア: {score}
      </div>
      {gameState === 'start' && (
        <div className="mt-4 text-center">
          クリックしてゲームを開始
        </div>
      )}
      {gameState === 'gameOver' && (
        <div className="mt-4 text-center text-red-500">
          ゲームオーバー！再度クリックしてリスタート
        </div>
      )}
    </div>
  );
};

export default ShootingGame;