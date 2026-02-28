"use client"

import { useState } from "react"
import { useRef } from "react"
import { useRouter } from "next/navigation"
import { TopNav } from "@/components/horiant/top-nav"
import { Footer } from "@/components/horiant/footer"
import { toast } from "sonner"
import { createWatch, deleteWatch } from "@/lib/actions/watches"
import { Loader2, Plus, X, Trash2 } from "lucide-react"

export function AdminClient({ recentWatches }: { recentWatches: any[] }) {
    const router = useRouter()
    const brandInputRef = useRef<HTMLInputElement>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // states for form
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [brand, setBrand] = useState("")
    const [model, setModel] = useState("")
    const [reference, setReference] = useState("")
    const [year, setYear] = useState("")
    const [caliber, setCaliber] = useState("")
    const [powerReserve, setPowerReserve] = useState("")
    const [caseSize, setCaseSize] = useState("")
    const [lugToLug, setLugToLug] = useState("")
    const [thickness, setThickness] = useState("")
    const [material, setMaterial] = useState("")
    const [waterResistance, setWaterResistance] = useState("")
    const [story, setStory] = useState("")
    const [category, setCategory] = useState("Dress")
    const [imageUrl, setImageUrl] = useState("")
    const [features, setFeatures] = useState<string[]>([])
    const [featureInput, setFeatureInput] = useState("")

    const handleAddFeature = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const val = featureInput.trim()
            if (val && !features.includes(val)) {
                setFeatures([...features, val])
                setFeatureInput("")
            }
        }
    }

    const handleRemoveFeature = (f: string) => {
        setFeatures(features.filter(x => x !== f))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = {
            brand, model, reference, year, caliber, powerReserve, caseSize, lugToLug,
            thickness, material, waterResistance, story, category, imageUrl, features
        }

        const res = await createWatch(formData)
        if (res.success) {
            toast(`Heritage Authenticated. ${brand} ${model} is now live in the database.`, { style: { background: '#131920', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)' }, icon: '✨' })
            // clear form
            setBrand("")
            setModel("")
            setReference("")
            setYear("")
            setCaliber("")
            setPowerReserve("")
            setCaseSize("")
            setLugToLug("")
            setThickness("")
            setMaterial("")
            setWaterResistance("")
            setStory("")
            setCategory("Dress")
            setImageUrl("")
            setFeatures([])
            router.refresh()
            brandInputRef.current?.focus()
        } else {
            toast.error(res.message)
        }
        setIsSubmitting(false)
    }

    const handleDelete = async (watchId: string) => {
        setIsDeleting(watchId)
        const res = await deleteWatch(watchId)
        if (res.success) {
            toast.success("Watch erased from database.")
            router.refresh()
        } else {
            toast.error(res.message)
        }
        setIsDeleting(null)
    }

    return (
        <div className="relative min-h-screen bg-background text-foreground">
            <TopNav />
            <main className="mx-auto max-w-[1440px] px-4 pt-24 pb-20 sm:px-6 lg:px-10 lg:pt-32">
                <div className="mb-12">
                    <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                        Admin System
                    </p>
                    <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">The Horiant Lab</h1>
                    <p className="mt-4 text-sm tracking-wide text-muted-foreground">Secure Interface for Database Expansion</p>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
                    {/* Form col */}
                    <div>
                        <form onSubmit={handleSubmit} className="card-glow rounded-xl border border-white/[0.04] bg-gradient-to-b from-[#131920] to-[#0d1117] p-6 shadow-2xl sm:p-8">
                            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/80">Brand *</label>
                                    <input ref={brandInputRef} required type="text" value={brand} onChange={e => setBrand(e.target.value)} className="w-full rounded-md border border-white/5 bg-black/40 px-4 py-3 text-sm focus:border-[#D4AF37]/50 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/80">Model *</label>
                                    <input required type="text" value={model} onChange={e => setModel(e.target.value)} className="w-full rounded-md border border-white/5 bg-black/40 px-4 py-3 text-sm focus:border-[#D4AF37]/50 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/80">Reference *</label>
                                    <input required type="text" value={reference} onChange={e => setReference(e.target.value)} className="w-full rounded-md border border-white/5 bg-black/40 px-4 py-3 text-sm focus:border-[#D4AF37]/50 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/80">Year</label>
                                    <input type="number" value={year} onChange={e => setYear(e.target.value)} className="w-full rounded-md border border-white/5 bg-black/40 px-4 py-3 text-sm focus:border-[#D4AF37]/50 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/80">Category</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full appearance-none rounded-md border border-white/5 bg-black/40 px-4 py-3 text-sm focus:border-[#D4AF37]/50 focus:outline-none">
                                        <option>Dress</option>
                                        <option>Diver</option>
                                        <option>Chronograph</option>
                                        <option>GMT</option>
                                        <option>Pilot</option>
                                        <option>Everyday</option>
                                        <option>Integrated</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/80">Image URL *</label>
                                    <input required type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full rounded-md border border-white/5 bg-black/40 px-4 py-3 text-sm focus:border-[#D4AF37]/50 focus:outline-none" />
                                </div>
                            </div>

                            <div className="mb-8 border-t border-white/[0.04] pt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">Technical Specifications</p>
                                </div>
                                <div>
                                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Caliber</label>
                                    <input type="text" value={caliber} onChange={e => setCaliber(e.target.value)} className="w-full rounded-md border border-white/5 bg-black/40 px-4 py-3 text-sm focus:border-[#D4AF37]/30 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Power Reserve</label>
                                    <input type="text" value={powerReserve} onChange={e => setPowerReserve(e.target.value)} className="w-full rounded-md border border-white/5 bg-black/40 px-4 py-3 text-sm focus:border-[#D4AF37]/30 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Material</label>
                                    <input type="text" value={material} onChange={e => setMaterial(e.target.value)} className="w-full rounded-md border border-white/5 bg-black/40 px-4 py-3 text-sm focus:border-[#D4AF37]/30 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Water Resistance</label>
                                    <input type="text" value={waterResistance} onChange={e => setWaterResistance(e.target.value)} className="w-full rounded-md border border-white/5 bg-black/40 px-4 py-3 text-sm focus:border-[#D4AF37]/30 focus:outline-none" />
                                </div>
                                <div className="grid grid-cols-3 gap-4 sm:col-span-2">
                                    <div>
                                        <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Case Size</label>
                                        <input type="text" value={caseSize} onChange={e => setCaseSize(e.target.value)} className="w-full rounded-md border border-white/5 bg-black/40 px-4 py-3 text-sm focus:border-[#D4AF37]/30 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Thickness</label>
                                        <input type="text" value={thickness} onChange={e => setThickness(e.target.value)} className="w-full rounded-md border border-white/5 bg-black/40 px-4 py-3 text-sm focus:border-[#D4AF37]/30 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Lug-to-Lug</label>
                                        <input type="text" value={lugToLug} onChange={e => setLugToLug(e.target.value)} className="w-full rounded-md border border-white/5 bg-black/40 px-4 py-3 text-sm focus:border-[#D4AF37]/30 focus:outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/[0.04] pt-8 grid grid-cols-1 gap-6">
                                <div>
                                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/80">Features / Complications (Press Enter)</label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {features.map(f => (
                                            <span key={f} className="flex items-center gap-1 rounded-sm border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs tracking-wide text-[#D4AF37]">
                                                {f}
                                                <button type="button" onClick={() => handleRemoveFeature(f)} className="ml-1 hover:text-white transition-colors"><X className="h-3 w-3" /></button>
                                            </span>
                                        ))}
                                    </div>
                                    <input type="text" value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={handleAddFeature} placeholder="e.g. Moonphase, GMT..." className="w-full rounded-md border border-white/5 bg-black/40 px-4 py-3 text-sm focus:border-[#D4AF37]/50 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/80">The Story (Legacy)</label>
                                    <textarea rows={4} value={story} onChange={e => setStory(e.target.value)} placeholder="Write the history of this timepiece..." className="w-full rounded-md border border-white/5 bg-black/40 px-4 py-3 text-sm leading-relaxed focus:border-[#D4AF37]/50 focus:outline-none resize-y"></textarea>
                                </div>
                            </div>

                            <button disabled={isSubmitting} type="submit" className="mt-8 flex w-full items-center justify-center gap-3 rounded-md border border-[#D4AF37] bg-[#D4AF37]/5 px-6 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10 disabled:opacity-50">
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                Insert into Database
                            </button>
                        </form>
                    </div>

                    {/* Side col: Recent Activity */}
                    <div className="hidden lg:block space-y-6">
                        <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] border-b border-white/[0.04] pb-4">
                            Recent Activity
                        </p>
                        <div className="flex flex-col gap-4">
                            {recentWatches.map(watch => (
                                <div key={watch.id} className="flex items-center gap-4 rounded-lg border border-white/5 bg-[#0D1117] p-4 transition-colors hover:border-white/10">
                                    <img src={watch.image_url || "/images/placeholder-watch.png"} alt={watch.model} className="h-12 w-12 rounded object-cover border border-white/10" />
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-[10px] uppercase tracking-widest text-[#D4AF37]">{watch.brand}</p>
                                        <p className="truncate text-sm font-medium text-foreground">{watch.model}</p>
                                        <p className="truncate text-[10px] text-muted-foreground">Ref. {watch.reference}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(watch.id)}
                                        disabled={isDeleting === watch.id}
                                        className="text-red-500/50 hover:text-red-400 transition-colors"
                                    >
                                        {isDeleting === watch.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    </button>
                                </div>
                            ))}
                            {recentWatches.length === 0 && (
                                <p className="text-xs text-muted-foreground">No recent entries found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
