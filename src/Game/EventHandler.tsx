import {FC, ReactNode, useEffect, useState} from "react";
import {observer} from "mobx-react";
import {Button} from "@/GameEngine/components";
import {game} from "@/Game/Classes/Game";

type EventHandlerProps = {
  BackdropComponent?: FC<{ children: ReactNode }>
  DialogComponent?: FC<{ children: ReactNode }>
}

// Todo it doesn't make sense to have this call the baseGame().
//  If the user has their own game() class it will not work together.

export const EventHandler = observer((
  {
    BackdropComponent,
    DialogComponent
  }: EventHandlerProps) => {
  const [autoRestart, setAutoRestart] = useState(false);
  // This is the issue. Here the base game is called instead of the game()
  const {events: {activeEvent}, tick} = game();
  const {start, stop, isActive} = tick

  useEffect(() => {
    if (activeEvent) {
      stop()
      if (isActive) {
        setAutoRestart(true)
      }
    }
  }, [activeEvent, isActive, stop]);

  const onClose = (): void => {
    activeEvent?.markAsShown()
    activeEvent?.updateResources()
    if (autoRestart) {
      start()
      setAutoRestart(false)
    }
  }

  if (!activeEvent) {
    return null
  }

  const Container = BackdropComponent || ContainerDefault
  const Dialog = DialogComponent || DialogDefault
  return (
    <Container>
      <Dialog>
        <div className="flex flex-col w-full h-full">
      <Header>
        {activeEvent.label}
      </Header>
      <Content>
      {activeEvent.description}
      </Content>
  {!activeEvent?.preventClose &&
  <Footer>
    <Button onClick={onClose} size="sm">
    Close
    </Button>
    </Footer>
  }
  </div>
  </Dialog>
  </Container>
)
})

const Header = ({children}: { children: ReactNode }) => (
  <div className="text-lg font-semibold mb-1">
    {children}
    </div>
)

const Content = ({children}: { children: ReactNode }) => (
  <div className="text-sm text-muted-foreground">
    {children}
    </div>
)

const Footer = ({children}: { children: ReactNode }) => (
  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
    {children}
    </div>
)

const ContainerDefault = ({children}: { children: ReactNode }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/90">
    {children}
    </div>
)

const DialogDefault = ({children}: { children: ReactNode }) => (
  <div
    className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
    {children}
    </div>
)
