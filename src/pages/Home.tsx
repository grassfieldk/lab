import { Container, SimpleGrid, Card, Stack, Group, Text, ThemeIcon } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { DiceFive } from '@phosphor-icons/react'

interface Tool {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  path: string
}

const tools: Tool[] = [
  {
    id: 'gacha-simulator',
    title: 'Gacha Simulator',
    description: 'Verify the effect of RNG adjustment in gacha mechanics',
    icon: <DiceFive size={32} />,
    path: '/gacha-simulator',
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <Container size="lg" py="lg">
      <Stack gap="lg">
        <div>
          <Text size="xl" fw={700} mb="xs">
            All tools
          </Text>
          <Text c="dimmed" size="sm">
            {tools.length} tools available
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              p="md"
              radius="md"
              withBorder
              className="tool-card"
              style={{
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
              onClick={() => navigate(tool.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--mantine-primary-color)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--mantine-color-gray-3)'
              }}
            >
              <Stack gap="md">
                <Group justify="center">
                  <ThemeIcon size="xl" radius="md" variant="light">
                    {tool.icon}
                  </ThemeIcon>
                </Group>
                <Stack gap="xs">
                  <Text fw={600} size="sm">
                    {tool.title}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {tool.description}
                  </Text>
                </Stack>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
