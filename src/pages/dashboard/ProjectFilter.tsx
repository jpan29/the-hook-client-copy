const filterList = [
  'All',
  'Mine',
  'Development',
  'Design',
  'Testing',
  'Deployment',
  'Marketing',
]
interface IProjectFilterProps {
  currentFilter: string
  filterHandler: (newFilter: string) => void
}
const ProjectFilter = ({
  currentFilter,
  filterHandler,
}: IProjectFilterProps) => {
  return (
    <div className="project--filter">
      <nav>
        <p>Filter by:</p>
        {filterList.map((el, i) => (
          <button
            key={i}
            onClick={() => filterHandler(el)}
            className={currentFilter === el ? 'active' : ''}>
            {el}
          </button>
        ))}
      </nav>
    </div>
  )
}
export default ProjectFilter
