import App from '@/components/App'
import RaffleListBrowseItem from '@/components/Raffle/RaffleListBrowseItem'

const RaffleListBrowse = ({ all, onParticipate, onClaim, onShare }) => {
  const handlePageChange = (value) => {
    console.log(value)
  }

  return (
    <App.Flex column gap={16}>
      <App.Flex wrap gap={[32, 16]} >
        {all.map(item => (
          <RaffleListBrowseItem key={item.hash} item={item} onParticipate={onParticipate} onClaim={onClaim} onShare={onShare} />
        ))}
      </App.Flex>

      <App.Flex center>
        <App.Pagination page={1} count={10} onChange={handlePageChange} />
      </App.Flex>
    </App.Flex>
  )
}

export default RaffleListBrowse