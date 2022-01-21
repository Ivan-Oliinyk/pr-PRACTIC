import { useAppSelector } from "../hooks/redux"
import { TItem } from "../store/reducers/mainReducer"


const styleItem: React.CSSProperties | undefined = {
  width: '200px',
  height: '20px',
  background: '#222',
  color: '#F00',
  marginBottom: '5px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  userSelect: 'none',
}









export default function Component2() {

  const list = useAppSelector(store => store.mainReducer)

  return (

    <div style={{ display: 'flex', flexDirection: 'column' }}>COMPONENT 2
      {
        Array(1000).fill('').map((_, idx) =>
          <div key={idx}>
            {
              Object.keys(list).map((key: string) =>
                <div key={key} style={styleItem}>
                  {list[key].value}
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}