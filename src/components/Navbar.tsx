"use client"

import { Dice5, Menu, WalletMinimal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { ModeToggle } from "./mode-toggle"

const Navbar = () => {

    // const scrollToHeader = () => {
    //     window.scrollTo({
    //         top: 0,
    //         behavior: 'smooth'
    //     })
    // }

  return (
    <nav className="z-10 fixed top-0  w-full">
        {/* NAVBAR */}
        <div className="flex p-4 py-6 sm:p-3 sm:mt-0 sm:text-left justify-between items-center dark:bg-[#0a0a0a] dark:bg-opacity-70 backdrop-blur-sm">
            <div className="flex flex-row items-center">
                <h3 className="hover:cursor-pointer">Web3 Lucky draw</h3>
                <Dice5 size={24} className="mx-2" />
            </div>

            {/* MOBILE NAVIGATION */}
            <Sheet>
                <SheetTrigger className="sm:hidden">
                    <Menu />
                </SheetTrigger>
                <SheetContent>
                    <div className="my-5 flex flex-col justify-center">
                        <Button variant='outline' className="m-2 w-full">Connect Wallet <WalletMinimal size={18} className="mx-1" /></Button>
                        <ModeToggle />
                    </div>
                </SheetContent>
            </Sheet>

            {/* DESKTOP NAVIGATION */}
            <div className="flex-row hidden sm:flex items-center">
                <Button variant='outline' className="mx-2">Connect Wallet <WalletMinimal size={18} className="mx-1" /></Button>
                <ModeToggle />
            </div>
        </div>
    </nav>
  )
}

export default Navbar