
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-8">Η σελίδα δεν βρέθηκε</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Η σελίδα που αναζητάτε δεν υπάρχει ή έχει μετακινηθεί. 
        Παρακαλώ ελέγξτε τη διεύθυνση ή επιστρέψτε στην αρχική σελίδα.
      </p>
      <Button asChild>
        <Link to="/">Επιστροφή στην αρχική</Link>
      </Button>
    </div>
  );
};

export default NotFound;
