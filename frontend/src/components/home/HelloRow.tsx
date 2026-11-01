type Props = {
  voicesHeard: number
  storiesTuned: number
  echoesHushed: number
  freshStories: number
}

/** Greeting with today's numbers. */
export function HelloRow({ voicesHeard, storiesTuned, echoesHushed, freshStories }: Props) {
  return (
    <section className="hello-row">
      <div>
        <p className="scribble-note">Tuesday’s show is already loud!</p>
        <h1>Good morning.</h1>
        <p className="intro">
          We heard <b>{voicesHeard} voices</b> and tuned them into <b>{storiesTuned} stories.</b>
        </p>
      </div>
      <div className="morning-stats">
        <div className="burst burst--yellow">
          <b>{echoesHushed}</b>
          <span>
            echoes
            <br />
            hushed
          </span>
        </div>
        <div className="burst burst--pink">
          <b>{freshStories}</b>
          <span>
            fresh
            <br />
            stories
          </span>
        </div>
        <div className="rough-note">
          same story,
          <br />
          less shouting! <i>↙</i>
        </div>
      </div>
    </section>
  )
}
