/**
 * ガチャ乱数調整検証シミュレーション
 */
import Table from 'cli-table3';

const TARGET_PROBABILITY = 0.005; // 0.5%
const TARGET_COUNT = 5; // 目標獲得数
const SIMULATION_TRIALS = 100000; // 試行回数
const ADJUSTMENT_TENSHOTS = 3; // 乱数調整で引く 10 連ガチャの回数

// シミュレーション結果用インターフェース
interface SimulationResult {
    paid: number;
    free: number;
    total: number;
}

// 統計データ用インターフェース
interface Statistics {
    average: number;
    min: number;
    max: number;
    median: number;
    results: number[];
}

/**
 * 10 連ガチャを引く
 * @returns 獲得した SSR の数
 */
function draw10Gacha(): number {
    let hitCount = 0;
    for (let i = 0; i < 10; i++) {
        if (Math.random() < TARGET_PROBABILITY) {
            hitCount++;
        }
    }
    return hitCount;
}

/**
 * 乱数調整用の無償10連ガチャ
 * @param tenShots 10連ガチャを引く回数
 */
function burnRng(tenShots: number): void {
    for (let i = 0; i < tenShots; i++) {
        draw10Gacha(); // 10連分の乱数を消費
    }
}

/**
 * パターン A: 通常パターン
 * @returns シミュレーション結果
 */
function simulatePatternA(): SimulationResult {
    let totalPaidDraws = 0;
    let acquiredTargets = 0;

    while (acquiredTargets < TARGET_COUNT) {
        // 有償10連
        const hits = draw10Gacha();
        totalPaidDraws += 10;
        acquiredTargets += hits;
    }

    return {
        paid: totalPaidDraws,
        free: 0,
        total: totalPaidDraws
    };
}

/**
 * パターン B: 乱数調整パターン
 * @returns シミュレーション結果
 */
function simulatePatternB(): SimulationResult {
    let totalPaidDraws = 0;
    let totalFreeDraws = 0;
    let acquiredTargets = 0;

    while (acquiredTargets < TARGET_COUNT) {
        // 有償 10 連
        const hits = draw10Gacha();
        totalPaidDraws += 10;

        // 獲得数を更新
        acquiredTargets += hits;

        if (hits > 0 && acquiredTargets < TARGET_COUNT) {
            // SSR が出た場合、まだ目標数に達していなければ乱数調整（10連×3回）を行う
            burnRng(ADJUSTMENT_TENSHOTS);
            totalFreeDraws += ADJUSTMENT_TENSHOTS * 10;
        }
    }

    return {
        paid: totalPaidDraws,
        free: totalFreeDraws,
        total: totalPaidDraws + totalFreeDraws
    };
}

/**
 * 統計を計算する
 */
function calculateStatistics(results: number[]): Statistics {
    if (results.length === 0) {
        return { average: 0, min: 0, max: 0, median: 0, results };
    }

    results.sort((a, b) => a - b);
    const sum = results.reduce((a, b) => a + b, 0);
    const average = sum / results.length;
    const min = results[0]!;
    const max = results[results.length - 1]!;

    const mid = Math.floor(results.length / 2);
    const median = results.length % 2 !== 0
        ? results[mid]!
        : (results[mid - 1]! + results[mid]!) / 2;
    return { average, min, max, median, results };
}

// メイン処理
/**
 * 結果を表形式で出力する
 */
function printResultTable(
    statsA: Statistics,
    statsBPaid: Statistics,
    statsBFree: Statistics,
    statsBTotal: Statistics
) {
    const table = new Table({
        head: [
            { content: '', colSpan: 1 },
            { content: '有償', colSpan: 4, hAlign: 'center' },
            { content: '無償', colSpan: 4, hAlign: 'center' },
            { content: '合計', colSpan: 4, hAlign: 'center' }
        ] as any[],
        style: { head: [], border: [] } // デフォルトの色付けを無効化
    });

    // サブヘッダー
    table.push([
        'パターン',
        '平均', '最小', '最大', '中央値',
        '平均', '最小', '最大', '中央値',
        '平均', '最小', '最大', '中央値'
    ]);

    // パターンA
    table.push([
        'A',
        statsA.average.toFixed(1), statsA.min, statsA.max, statsA.median,
        '-', '-', '-', '-', // 無償
        '-', '-', '-', '-'  // 合計
    ]);

    // パターンB
    table.push([
        'B',
        statsBPaid.average.toFixed(1), statsBPaid.min, statsBPaid.max, statsBPaid.median,
        statsBFree.average.toFixed(1), statsBFree.min, statsBFree.max, statsBFree.median,
        statsBTotal.average.toFixed(1), statsBTotal.min, statsBTotal.max, statsBTotal.median
    ]);

    console.log(table.toString());
}

// メイン処理
function main() {
    console.log("シミュレーション開始...");

    // パターンA
    const resultsA: SimulationResult[] = [];
    for (let i = 0; i < SIMULATION_TRIALS; i++) {
        resultsA.push(simulatePatternA());
    }
    const statsA = calculateStatistics(resultsA.map(r => r.paid));

    // パターンB
    const resultsB: SimulationResult[] = [];
    for (let i = 0; i < SIMULATION_TRIALS; i++) {
        resultsB.push(simulatePatternB());
    }
    const statsBPaid = calculateStatistics(resultsB.map(r => r.paid));
    const statsBFree = calculateStatistics(resultsB.map(r => r.free));
    const statsBTotal = calculateStatistics(resultsB.map(r => r.total));

    // 結果出力
    printResultTable(statsA, statsBPaid, statsBFree, statsBTotal);

    console.log("\nシミュレーション終了");
}

main();
