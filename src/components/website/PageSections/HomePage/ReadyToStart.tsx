import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const ReadyToStart = () => {
    return (
        <section className="py-12 md:py-16 px-6 lg:px-12">
            <div className="container mx-auto">
                <div className="bg-primary rounded-3xl p-12 md:p-16 text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                        Ready to start your musical journey
                    </h2>
                    <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Every detail has been crafted to help you focus on what matters most your music. Join and learning piano with us today.
                    </p>
                    <div className="pt-4">
                        <Link href="/academy">
                            <Button className="bg-white hover:bg-white/90 text-primary rounded-lg px-10 py-6 h-auto text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                                Go to Academy
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ReadyToStart