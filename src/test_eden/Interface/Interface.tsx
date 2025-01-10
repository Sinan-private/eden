import {Debug_BehemothControls} from "../Debugging/Debug_BehemothControls.tsx";
import {TopBar} from "./TopBar.tsx";
import {Box} from "@mui/material";
import {FactionManager} from "./FactionManager.tsx";
import {SlaveManager} from "../Components/SlaveManager.tsx";

export const Interface = () => {
  return (
    <>
      <Layout />
      <TopBar/>
      <Debug_BehemothControls/>
      <Box sx={{position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)'}}>
        <FactionManager/>
      </Box>
      <Box sx={{position: 'absolute', bottom: 50, right: 50, zIndex: 1}}>
        <SlaveManager/>
      </Box>
    </>
  )
}

export const Layout = () => {
  return (
    <div className="grid-container">
      <header className="grid-item header">Header</header>
      <aside className="grid-item sidebar">Sidebar</aside>
      <aside className="grid-item spacer"></aside>
      <main className="grid-item main">Main Content</main>
      <footer className="grid-item footer">Footer</footer>
    </div>
  );
};