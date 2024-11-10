import { Motion } from '@components/Motion'
import { useWinnersSummary } from '@src/queries/dashboard'

import { useMemo, useState } from 'react'

import classNames from 'classnames'

import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Chart, registerables } from 'chart.js'
import { useFriends } from '@src/queries/friends'
import { useUser } from '@src/queries/user'
import { WinPercentageDoughnut } from './WinPercentageDoughnut'
import { WinCountBar } from './WinCountBar'
import Tabs from '@mui/material/Tabs/Tabs'
import { Tab } from '@mui/material'
import { Title } from '@components/Title'

Chart.register(ChartDataLabels)
Chart.register(...registerables)

const draculaColors = [
  '#FF79C6',
  '#BD93F9',
  '#8BE9FD',
  '#50FA7B',
  '#FFB86C',
  '#FF5555',
  '#F1FA8C',
  '#F8F8F2',
]

const getUserKey = (friend: { type: string; id: number }) =>
  `${friend.type}${friend.id}`

const Dashboard = () => {
  const winnersSummaryQuery = useWinnersSummary()
  const userQuery = useUser()
  const friendsQuery = useFriends()

  const [selectedTab, setSelectedTab] = useState(0)

  const winnersData = useMemo(() => {
    if (!winnersSummaryQuery.data || !friendsQuery.data || !userQuery.data) {
      return
    }

    const { winnersByBoardgame, matchesCount } = winnersSummaryQuery.data

    const winsMappedByPlayer = winnersByBoardgame.reduce(
      (result, boardgameSummary) => {
        const { players } = boardgameSummary

        players.forEach((player) => {
          const playerKey = getUserKey(player)
          result[playerKey] = (result[playerKey] ?? 0) + player.wins
        })

        return result
      },
      {} as Record<string, number>,
    )

    const friendNames = friendsQuery.data.reduce(
      (result, friend) => ({
        ...result,
        [getUserKey(friend)]: friend.fullName,
      }),
      {} as Record<string, string>,
    )
    friendNames[`USER${userQuery.data?.id}`] = 'You'

    const getWinsByPlayer = (
      winsMappedByPlayer: Record<string, number>,
      options?: { byPercentage: boolean },
    ) => {
      const { byPercentage } = options || {}

      return Object.entries(winsMappedByPlayer || {})
        .map(([playerKey, wins]) => {
          return {
            playerKey,
            // @NOTE: Should backend return the name of the anon player?
            name: friendNames[playerKey] || 'Anon',
            value: byPercentage ? wins / matchesCount : wins,
            type: 'count',
          }
        })
        .sort((a, b) => a.name.localeCompare(b.name))
    }

    const winsByPlayer = getWinsByPlayer(winsMappedByPlayer)
    const winPercentageByPlayer = getWinsByPlayer(winsMappedByPlayer, {
      byPercentage: true,
    })

    const playerKeys = Object.keys(winsMappedByPlayer)

    const labels = Object.values(winsByPlayer).map((player) => player.name)

    return {
      labels,
      playerKeys,
      winsByPlayer,
      winPercentageByPlayer,
    }
  }, [winnersSummaryQuery.data, friendsQuery.data, userQuery.data])

  const colors = useMemo(() => {
    if (!winnersData) {
      return {}
    }

    return winnersData.playerKeys.reduce((result, playerKey, index) => {
      result[playerKey] = draculaColors[index % draculaColors.length]
      return result
    }, {} as Record<string, string>)
  }, [winnersData])

  return (
    <Motion style={{ width: '100%' }}>
      <Title title="Wins" />

      <Tabs
        variant="fullWidth"
        value={selectedTab}
        onChange={(_, value) => setSelectedTab(value)}
        centered
        sx={{
          paddingBottom: 3,
        }}
      >
        <Tab label="Percentage" />
        <Tab label="Quantity" />
      </Tabs>

      <div className="relative w-full">
        <div
          className={classNames(
            'absolute w-full top-0 left-0 transition-opacity duration-300 ease-in-out',
            selectedTab === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}
        >
          <WinPercentageDoughnut
            colorsByPlayer={colors}
            playerNames={winnersData?.labels || []}
            winPercentageByPlayer={winnersData?.winPercentageByPlayer || []}
          />
        </div>

        <div
          className={classNames(
            'absolute w-full top-0 left-0 transition-opacity duration-300 ease-in-out',
            selectedTab === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}
        >
          <WinCountBar
            colorsByPlayer={colors}
            playerNames={winnersData?.labels || []}
            winsByPlayer={winnersData?.winsByPlayer || []}
          />
        </div>
      </div>
    </Motion>
  )
}

export default Dashboard
