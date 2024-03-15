export async function getMinecraftUserData(req, res) {
  const username = req.params.username;
  try {
    const response = await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${username}`,
    );
    const data = await response.json();
    res.json({ uuid: data.id, name: data.name });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from Mojang API" });
  }
}
