import os
from django.conf import settings
from django.http import JsonResponse
import subprocess
import json
from django.views.decorators.csrf import csrf_exempt

def simulate_cache(request):
    file_param = request.GET.get('file')
    stream_param = request.GET.get('stream')

    if file_param:
        file_path = os.path.join(settings.BASE_DIR, file_param)
        if not os.path.exists(file_path):
            return JsonResponse({'error': 'Input file not found'}, status=400)
        
        command = ['core cache engine/cache_engine.exe', file_path]

    elif stream_param:
        keys = stream_param.split(',')
        command = ['core cache engine/cache_engine.exe', *keys]

    else:
        return JsonResponse({'error': 'No stream or file input provided'}, status=400)

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True
        )
        output = json.loads(result.stdout)
        return JsonResponse(output)
    except subprocess.CalledProcessError as e:
        return JsonResponse({'error': 'Engine failed', 'details': str(e)}, status=500)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid output from engine'}, status=500)


@csrf_exempt
def upload_file_simulation(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        if not file:
            return JsonResponse({'error': 'No file uploaded'}, status=400)

        # Save uploaded file temporarily
        file_path = os.path.join(settings.BASE_DIR, 'uploaded_input.txt')
        with open(file_path, 'wb+') as dest:
            for chunk in file.chunks():
                dest.write(chunk)

        try:
            # Call the compiled C++ engine with the uploaded file
            result = subprocess.run(
                ['./cache_engine', file_path],
                capture_output=True,
                text=True,
                check=True
            )
            output = json.loads(result.stdout)
            return JsonResponse(output)

        except subprocess.CalledProcessError as e:
            return JsonResponse({'error': 'Engine execution failed', 'details': e.stderr}, status=500)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Engine output was not valid JSON'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)