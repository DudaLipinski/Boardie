import { useEffect, useRef } from 'react'

import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Chart, registerables } from 'chart.js'

Chart.register(ChartDataLabels)
Chart.register(...registerables)

export const DoughnutChart = ({
  colorsByPlayer,
  playerNames,
  winPercentageByPlayer,
}: {
  colorsByPlayer: Record<string, string>
  playerNames: string[]
  winPercentageByPlayer: {
    playerKey: string
    name: string
    value: number
    type: string
  }[]
}) => {
  const chartCanvas = useRef<HTMLCanvasElement>(null)
  const chart = useRef<Chart<'doughnut', any, any>>()

  useEffect(() => {
    if (!chartCanvas.current || !winPercentageByPlayer) {
      return
    }

    if (chart.current) {
      chart.current.destroy()
    }

    chart.current = new Chart(chartCanvas.current, {
      type: 'doughnut',
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#fff',
              usePointStyle: true,
              pointStyleWidth: 16,
              font: {
                size: 11,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => (context.parsed * 100).toFixed(1) + '%',
            },
          },
          datalabels: {
            display: 'auto',
            formatter: (value) => {
              return (value.value * 100).toFixed(0) + '%'
            },
            color: '#020617',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            borderRadius: 24,
            padding: 5,
            clip: true,
            font: {
              weight: 'bold',
              size: 10,
            },
            anchor: 'center',
          },
        },
        elements: {
          arc: {
            borderWidth: 0,
            backgroundColor: (ctx) =>
              colorsByPlayer[(ctx.raw as any)?.playerKey],
          },
        },
      },
      data: {
        labels: playerNames,
        datasets: [
          {
            data: winPercentageByPlayer,
            hoverOffset: 4,
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
