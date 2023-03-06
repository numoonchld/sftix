import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div
        className='w-100 d-flex justify-content-center align-items-center'
        style={{ height: "90vh" }}>
        <div className='card bg-white px-1 py-5'>
          <Link className="btn btn-success btn-lg mx-3" href="/ticket-counter">
            Ticket counter
          </Link>
          <hr style={{ backgroundColor: "#512DA8", width: "100%" }} />
          <Link className="btn btn-primary mx-5" href="/organizer-dashboard">
            Organizer dashboard
          </Link>
        </div>
      </div>
    </>
  )
}
