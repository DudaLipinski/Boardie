import { useEffect, useRef } from 'react'

import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Chart, registerables } from 'chart.js'

Chart.register(ChartDataLabels)
Chart.register(...registerables)

export const WinCountBar = ({
  colorsByPlayer,
  playerNames,
  winsByPlayer: winPercentageByPlayer,
}: {
  colorsByPlayer: Record<string, string>
  playerNames: string[]
  winsByPlayer: {
    playerKey: string
    name: string
    value: number
    type: string
  }[]
}) => {
  const chartCanvas = useRef<HTMLCanvasElement>(null)
  const chart = useRef<Chart<'bar', any, any>>()

  useEffect(() => {
    if (!chartCanvas.current || !winPercentageByPlayer) {
      return
    }

    if (chart.current) {
      chart.current.destroy()
    }

    chart.current = new Chart(chartCanvas.current, {
      type: 'bar',
      options: {
        scales: {
          y: {
            display: false,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            display: 'auto',
            color: '#020617',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            borderRadius: 24,
            padding: 5,
            clip: true,
            font: {
              weight: 'bold',
              size: 11,
            },
          },
        },
      },
      data: {
        labels: playerNames,
        datasets: [
          {
            backgroundColor: winPercentageByPlayer.map(
              (player) => colorsByPlayer[player.playerKey],
            ),
            data: winPercentageByPlayer.map((player) => player.value),
          },
        ],
      },
    })

    return () => {
      chart.current?.destroy()
    }
  }, [winPercentageByPlayer])

  return (
    <canvas
      id="winners-summary-canvas"
      ref={chartCanvas}
      width={400}
      height={400}
    />
  )
}
