## Voxel lightning

Basic test with:

* Big procedural level
* Space is split in small cubes with a 8 bit value of luminosity (0=wall, 255=light)
* Support:
  - Environment light (directional) propagated through raycast
  - Spot light for torch of lamp propagated through bfs
* Use back those luminosity points to:
  - Vertex color
  - Sprite color