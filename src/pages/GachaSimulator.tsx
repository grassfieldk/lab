import { useState } from 'react'
import { Container, Title, SimpleGrid, Card, Stack, Button, NumberInput, Table, Text } from '@mantine/core'
import { runSimulation } from '../gacha_simulation'

interface SimulationState {
  isLoading: boolean
  result?: ReturnType<typeof runSimulation>
  trials: number
}

interface Stats {
  average: number
  min: number
  max: number
  median: number
}

function StatsTable({ stats }: { stats: Stats }) {
  return (
    <Table striped highlightOnHover>
      <Table.Tbody>
        {Object.entries(stats).map(([key, value]) => (
          <Table.Tr key={key}>
            <Table.Td fw={500}>{key === 'average' ? '平均' : key === 'min' ? '最小' : key === 'max' ? '最大' : '中央値'}</Table.Td>
            <Table.Td>{typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(1) : value}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

export default function GachaSimulator() {
  const [state, setState] = useState<SimulationState>({
    isLoading: false,
    result: undefined,
    trials: 100,
  })

  const handleSimulate = () => {
    setState(prev => ({ ...prev, isLoading: true }))
    setTimeout(() => {
      const result = runSimulation(state.trials)
      setState(prev => ({ ...prev, isLoading: false, result }))
    }, 0)
  }

  const handleTrialsChange = (value: number | string) => {
    setState(prev => ({ ...prev, trials: Math.max(1, parseInt(String(value)) || 1) }))
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1}>ガチャシミュレータ</Title>
          <Text c="dimmed" mt="xs">
            乱数調整の効果を検証するシミュレーション
          </Text>
        </div>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <NumberInput
              label="試行回数"
              min={1}
              max={100000}
              value={state.trials}
              onChange={handleTrialsChange}
              disabled={state.isLoading}
            />
            <Button
              onClick={handleSimulate}
              loading={state.isLoading}
              disabled={state.isLoading}
            >
              シミュレーション実行
            </Button>
          </Stack>
        </Card>

        {state.result && (
          <Stack gap="lg">
            <Title order={2} size="h3">
              シミュレーション結果
            </Title>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={3} size="h4">
                    パターン A: 通常パターン
                  </Title>
                  <StatsTable stats={state.result.patternA} />
                </Stack>
              </Card>

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={3} size="h4">
                    パターン B: 乱数調整パターン
                  </Title>
                  <Stack gap="md">
                    <div>
                      <Text fw={500} size="sm" mb="md">
                        有償ガチャ
                      </Text>
                      <StatsTable stats={state.result.patternBPaid} />
                    </div>
                    <div>
                      <Text fw={500} size="sm" mb="md">
                        無償ガチャ
                      </Text>
                      <StatsTable stats={state.result.patternBFree} />
                    </div>
                    <div>
                      <Text fw={500} size="sm" mb="md">
                        合計
                      </Text>
                      <StatsTable stats={state.result.patternBTotal} />
                    </div>
                  </Stack>
                </Stack>
              </Card>
            </SimpleGrid>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Title order={3} size="h4">
                  比較分析
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                  <div>
                    <Text c="dimmed" size="sm" mb="xs">
                      有償平均の差
                    </Text>
                    <Text size="xl" fw={700}>
                      {(state.result.patternBPaid.average - state.result.patternA.average).toFixed(1)}
                    </Text>
                  </div>
                  <div>
                    <Text c="dimmed" size="sm" mb="xs">
                      乱数調整で消費（平均）
                    </Text>
                    <Text size="xl" fw={700}>
                      {state.result.patternBFree.average.toFixed(1)}
                    </Text>
                  </div>
                  <div>
                    <Text c="dimmed" size="sm" mb="xs">
                      合計の差
                    </Text>
                    <Text size="xl" fw={700}>
                      {(state.result.patternBTotal.average - state.result.patternA.average).toFixed(1)}
                    </Text>
                  </div>
                </SimpleGrid>
              </Stack>
            </Card>
          </Stack>
        )}
      </Stack>
    </Container>
  )
}
