import React from 'react'

function Header() {
  return (
    <div className='max-h-[10vh] absolute top-0 left-0'>
        <img
        alt="bg"
        src={'https://images.unsplash.com/photo-1490093158370-1a6be674437b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1614&q=80'}
        style={{
            width: '100%',
            height: '100px',
        }}
        // objectFit="cover"
        resizeMode="fill"
        />


    </div>
  )
}

export default Header