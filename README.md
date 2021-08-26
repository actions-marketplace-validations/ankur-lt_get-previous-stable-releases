 ```yaml
  - name: Get previous stable releases
    uses: ankur-lt/get-previous-stable-releases@1.0.2
    id: previousstableversions
    with:
      user: UserName
      repoName: repoName
      accessToken: ${{ secrets.ACCESS_TOKEN }}

```
