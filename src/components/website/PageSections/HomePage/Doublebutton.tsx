import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Doublebutton = () => {
    return (
        <section className="py-12 md:py-16 px-6">
            <div className="container mx-auto">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/academy">
                        <Button className="bg-[#3EADB5] hover:bg-[#35999F] text-white px-8 py-6 rounded-lg text-base font-semibold transition-all shadow-md hover:shadow-lg min-w-[200px]">
                            Join the Academy
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-lg text-base font-semibold transition-all shadow-md hover:shadow-lg min-w-[200px]">
                            Login to Academy
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Doublebutton