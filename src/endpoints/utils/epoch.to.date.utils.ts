import moment from 'moment';

export const calcUnlockDate = ({ epochs, stats }: { epochs: number; stats: any }) => {
  if (!stats) {
    return undefined;
  }

  return epochs > 0
    ? epochs === 1
      ? moment(stats.nextEpochDate)
      : moment(stats.nextEpochDate).add(stats.epochDurationSec * (epochs - 1), 'seconds')
    : moment();
};

export const calcIsToday = (unlockDate?: moment.Moment) => {
  return Boolean(unlockDate?.isSame(new Date(), 'day'));
};

export const calcAlreadyUnlocked = (unlockDate?: moment.Moment) => {
  return Boolean(unlockDate?.isSameOrBefore(new Date()));
};

export const calcUnlockDateText = ({
  epochs,
  stats,
  hasSteps,
}: {
  epochs: number;
  stats: any;
  hasSteps: boolean;
}) => {
  const unlockDate = calcUnlockDate({
    stats,
    epochs,
  });
  const isToday = calcIsToday(unlockDate);
  const alreadyUnlocked = calcAlreadyUnlocked(unlockDate);
  const unlocksLaterToday = isToday && Boolean(unlockDate?.isAfter(new Date()));

  let unlocksAtText, unlocksAtDate;

  switch (true) {
    case alreadyUnlocked:
      unlocksAtText = '';
      unlocksAtDate = 'Unlockable now';
      break;

    case unlocksLaterToday:
      unlocksAtText = 'Unlockable today';
      unlocksAtDate = unlockDate ? unlockDate.format('hh:mm A') : '...';
      break;

    default:
      unlocksAtText = hasSteps ? 'Starts unlocking' : 'Unlocks on';
      unlocksAtDate = unlockDate ? unlockDate.format('MMM Do YYYY') : '...';
      break;
  }

  return { unlocksAtText, unlocksAtDate };
};
