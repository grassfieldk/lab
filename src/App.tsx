import { Routes, Route } from 'react-router-dom'
import { AppShell, TextInput, Stack, Group, Text, ActionIcon, useMantineColorScheme } from '@mantine/core'
import { MagnifyingGlass, Moon, Sun } from '@phosphor-icons/react'
import { useDisclosure } from '@mantine/hooks'
import Home from './pages/Home'
import GachaSimulator from './pages/GachaSimulator'
import classes from './App.module.css'

const categories = [
  { label: 'All tools', path: '/' },
  { label: 'Simulation', path: '/simulation' },
]

export default function App() {
  const [opened, { toggle }] = useDisclosure()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: false },
      }}
      padding="md"
    >
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Text fw={700} size="lg">Lab</Text>
            <ActionIcon
              onClick={() => toggleColorScheme()}
              variant="default"
              size="lg"
              aria-label="Toggle color scheme"
            >
              {colorScheme === 'dark' ? (
                <Sun size={16} />
              ) : (
                <Moon size={16} />
              )}
            </ActionIcon>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md" className={classes.navbar}>
          <AppShell.Section>
            <TextInput
              placeholder="Search tools..."
              leftSection={<MagnifyingGlass size={14} />}
              size="sm"
              mb="lg"
            />
          </AppShell.Section>

          <AppShell.Section grow>
            <Stack gap="xs">
              {categories.map((cat) => (
                <a
                  key={cat.path}
                  href={cat.path}
                  className={classes.navLink}
                  onClick={(e) => {
                    e.preventDefault()
                    window.history.pushState(null, '', cat.path)
                    if (opened) toggle()
                  }}
                >
                  {cat.label}
                </a>
              ))}
            </Stack>
          </AppShell.Section>
        </AppShell.Navbar>

        <AppShell.Main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulation" element={<Home />} />
            <Route path="/gacha-simulator" element={<GachaSimulator />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    )
}
