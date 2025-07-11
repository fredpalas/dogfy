import { PollDeliveryStatusesCommand } from "./PollDeliveryStatusesCommand";

PollDeliveryStatusesCommand.run()
  .then(() => {
    console.log('Poll Delivery Statuses Command completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error running Poll Delivery Statuses Command:');
    console.log('', error.toString());
    process.exit(1);
  });
