import runpy
import os

# Run the actual training script in backend/models
script_path = os.path.join(os.path.dirname(__file__), 'models', 'train_model.py')
runpy.run_path(script_path, run_name='__main__')

