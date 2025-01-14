import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
let countdownInterval;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      document.querySelector('[data-start]').disabled = true;
      userSelectedDate = null;
    } else {
      document.querySelector('[data-start]').disabled = false;
      userSelectedDate = selectedDate;
    }
  },
};

flatpickr('#datetime-picker', options);

document.querySelector('[data-start]').addEventListener('click', () => {
  if (!userSelectedDate) {
    iziToast.error({
      title: 'Error',
      message: 'No valid date selected.',
    });
    return;
  }

  startCountdown(userSelectedDate);
  document.getElementById('datetime-picker').disabled = true;
  document.querySelector('[data-start]').disabled = true;
});

function startCountdown(targetDate) {
  function updateCountdown() {
    const currentDate = new Date();
    const difference = targetDate.getTime() - currentDate.getTime();

    if (difference <= 0) {
      clearInterval(countdownInterval);
      displayTimeLeft(0);
      document.getElementById('datetime-picker').disabled = false;
      document.querySelector('[data-start]').disabled = true;
      iziToast.success({
        title: 'Countdown Finished',
        message: 'The countdown timer has ended.',
      });
    } else {
      displayTimeLeft(difference);
    }
  }

  function displayTimeLeft(ms) {
    const { days, hours, minutes, seconds } = convertMs(ms);
    document.querySelector('[data-days]').textContent = addLeadingZero(days);
    document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
    document.querySelector('[data-minutes]').textContent =
      addLeadingZero(minutes);
    document.querySelector('[data-seconds]').textContent =
      addLeadingZero(seconds);
  }

  countdownInterval = setInterval(updateCountdown, 1000);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}
