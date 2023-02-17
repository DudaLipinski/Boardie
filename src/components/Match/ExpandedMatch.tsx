export const expandedRowRender = () => {
  const data = [
    {
      player: 'Leo',
      score: '30',
    },
    {
      player: 'Kresh',
      score: '30',
    },
    {
      player: 'Gui',
      score: '30',
    },
  ]

  return <p>{data[0].player}</p>
}
