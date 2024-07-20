import { auth } from "@clerk/nextjs/server";
import Collection from "@components/shared/Collection";
import { Button } from "@components/ui/button";
import { getEventsByUser } from "@lib/actions/event.actions";
import { SearchParamProps } from "@types";
import Link from "next/link";
import React from "react";

const ProfilePage = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const organisedEvents = await getEventsByUser({ userId, page: 1 });

  return (
    <>
      {/* My tickets */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild className="button hidden sm:flex">
            <Link href="/#events">Explore More Evnets</Link>
          </Button>
        </div>
      </section>
      {/* <section className="wrapper my-8">
        <Collection
          data={events?.data}
          emptyTitle="No events tickets purchased yet"
          emptyStateSubtext="No worries you can explore more events"
          collectionType="My_Tickets"
          limit={3}
          page={1}
          urlParamName="ordersPage"
          totalPages={2}
        />
      </section> */}

      {/* {events organised} */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Events Organised</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={organisedEvents?.data}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go ahead and create your first event"
          collectionType="Events_Organized"
          limit={3}
          page={1}
          urlParamName="page"
          totalPages={2}
        />
      </section>
    </>
  );
};

export default ProfilePage;
