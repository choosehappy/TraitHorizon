def test_index_route(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b'<html>' in response.data  # Check if HTML content is returned

def test_image_route(client):
    response = client.get('/image/0_962_2146_[x=103709,y=30999,w=700,h=360]_sup_2.png')
    assert response.status_code == 200
    assert response.mimetype.startswith('image/')  # Check if an image is returned

def test_tsv_route(client):
    response = client.get('/tsv')
    assert response.status_code == 200
    assert response.mimetype == 'text/tab-separated-values'  # Check if TSV file is returned

def test_hide_axes_route(client):
    response = client.get('/hide_axes')
    assert response.status_code == 200
    assert response.mimetype == 'application/json'  # Check if JSON is returned
    assert response.json['hide_axes'] == {'x': False, 'y': True}  # Validate JSON content
