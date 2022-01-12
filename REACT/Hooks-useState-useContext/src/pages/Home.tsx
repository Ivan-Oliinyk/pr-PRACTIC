import React, { useState } from 'react'
import Container1 from '../containers/Container1'
import Container2 from '../containers/Container2'

const defaultData: {[key: string]: string} = {
  name: "gdfgjdkjfgkldf",
  email: ""
}


export default () => {
  const [data, setData] = useState<{[key: string]: string}>(defaultData)
  
  return (
    <div style={{display: 'flex', justifyContent: "space-between", width: "50%", margin: "auto"}}>
      <div style={{flex: "0 auto", borderRight: "1px solid black"}}>
        <Container1 setData={setData}/>
      </div>
      <div style={{flex: "0 auto"}}>
        <Container2 data={data} setData={setData}/>
        </div>
    </div>
  )
}